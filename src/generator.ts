import type {
    Branch,
    GeneratorDynamicInput,
    GeneratorInput,
    GeneratorOptions, IConditional,
    IGenerator,
    IInput,
} from "./interface";
import {InputState, IsDynamicInput} from "./interface";
import EventListenerPool from "hcore/dist/eventListenerPool";
import type {Tree} from "hcore/dist/tree";
import {Configurable} from "./configurable";

type TraversalFn = (child: Tree<Branch>, parent: Tree<Branch> | null) => void | boolean;

export class Generator<Options extends GeneratorOptions = GeneratorOptions> extends Configurable<Options> implements IGenerator {

    public readonly branches: Tree<Branch>;
    private activeInputs: {[id: string]: GeneratorInput} = {};

    public readonly onValidCode: EventListenerPool<IInput[]> = new EventListenerPool<IInput[]>();
    public readonly onInvalidCode: EventListenerPool<void> = new EventListenerPool<void>();

    public readonly container: HTMLElement;

    private _valid = false;

    constructor(container: HTMLElement, root: Tree<Branch>, options: Options) {
        super(options);
        this.container = container;
        this.branches = root;
    }

    public getActiveInputs(): IInput[] {
        return Object.keys(this.activeInputs).map((id) => {
            const input = this.activeInputs[id];
            if (IsDynamicInput(input)) {
                const activeInput = this.getActiveInput(input);
                if (!activeInput) {
                    throw new Error("No active input");
                }
                return activeInput;
            } else {
                return input;
            }
        });
    }

    public get valid() { return this._valid; }

    public validate() {
        let isValid = true;
        this.traverse(this.branches, (node: Tree<Branch>, parent: Tree<Branch> | null) => {
            if (this.checkConditionals(node.value.conditions) && !this.allInputsValid(node)) {
                isValid = false;
                return false;
            }
        });
        return isValid;
    }

    public update(node?: Tree<Branch>) {

        let mightBeValid = false;
        let isValid = false;

        this.traverse(node ? node : this.branches, (node: Tree<Branch>, parent: Tree<Branch> | null) => {
            for (const listener of node.value.listeners) {
                listener.remove();
            }

            if (this.checkConditionals(node.value.conditions)) {
                this.activateBranch(node);

                const hasChildren = Object.keys(node.children).length !== 0;

                if (!hasChildren) {
                    mightBeValid = true;
                }
            } else {
                this.deactivateBranch(node);
            }
        });

        if (mightBeValid && this.validate()) {
            isValid = true;
        }

        if (isValid) {
            this._valid = true;
            this.onValidCode.emit(this.getActiveInputs());
        } else {
            this._valid = false;
            this.onInvalidCode.emit(void 0);
        }
    }

    private activateBranch(node: Tree<Branch>) {
        for (const input of node.value.inputs) {
            if (IsDynamicInput(input)) {
                for (const inp of input) {
                    if (this.checkConditionals(inp.dependsOn)) {
                        this.activateInput(node, inp.input);
                    } else {
                        inp.input.hide();
                        delete this.activeInputs[inp.input.id];
                    }
                }
            } else {
                this.activateInput(node, input);
            }
        }
    }

    private activateInput(node: Tree<Branch>, input: IInput) {
        input.show();
        node.value.listeners.push(input.onChange.listen(() => {
            this.update(node);
        }));
        this.activeInputs[input.id] = input;
    }

    private allInputsValid(node: Tree<Branch>) {
        for (const input of node.value.inputs) {
            if (IsDynamicInput(input)) {
                const activeInput = this.getActiveInput(input);
                if (!activeInput || activeInput.getState() !== InputState.Valid) {
                    return false;
                }
            }
            else if (input.getState() !== InputState.Valid) return false;
        }

        return true;
    }

    private getActiveInput(input: GeneratorDynamicInput[]): IInput | void {
        for (const possibleInput of input) {
            if (this.checkConditionals(possibleInput.dependsOn)) {
                return possibleInput.input;
            }
        }
    }

    private deactivateBranch(node: Tree<Branch>) {
        for (const input of node.value.inputs) {
            if (IsDynamicInput(input)) {
                const activeInput = this.getActiveInput(input);
                if (activeInput) {
                    activeInput.hide();
                    delete this.activeInputs[activeInput.id];
                }
            } else {
                input.hide();
                delete this.activeInputs[input.id];
            }
        }
    }

    private checkConditionals(conditionals: IConditional[]): boolean {
        let passedConditions = true;

        for (const condition of conditionals) {
            if (!condition.input.isVisible() || !condition.check(condition.input.getParsed())) {
                passedConditions = false;
                break;
            }
        }

        return passedConditions;
    }

    private traverse(node: Tree<Branch>, handler: TraversalFn, parent: Tree<Branch> | null = null) {
        const res = handler(node, parent);
        if (res !== false) {
            for (const id in node.children) {
                this.traverse(node.children[id], handler, node);
            }
        }
    }
}
