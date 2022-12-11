import type {
    ConstantOptions,
    PCG_BranchConfig,
    InputFactory,
    InputFactoryFn,
    NumericOptions,
    Branch,
    InputConfig,
    IInput,
    ConditionalConfig,
    IConditional,
    ConditionFactory,
    ConditionalFactoryFn,
    ComparisonOptions, RangeOptions, SpecificOptions, GeneratorDynamicInput
} from "./interface";
import {Generator} from "./generator";
import {Constant} from "./inputs/constant";
import {Decimal} from "./inputs/decimal";
import {Integer} from "./inputs/Integer";
import {Dropdown} from "./inputs/dropdown";
import {IsDynamicInputConfig} from "./interface";
import {Tree} from "hcore/dist/tree";
import {Comparison} from "./conditionals/comparison";
import {Specific} from "./conditionals/specific";
import {Range} from "./conditionals/range";

export class GeneratorFactory {
    private static readonly InputFactory: InputFactory[] = [];
    private static readonly ConditionalFactory: ConditionFactory[] = [];

    public static RegisterInput(name: string, factory: InputFactoryFn) {
        this.InputFactory.push({
            name,
            factory,
        });
    }

    public static RegisterConditional(name: string, factory: ConditionalFactoryFn) {
        this.ConditionalFactory.push({
            name,
            factory,
        });
    }

    public static Create(container: HTMLElement, config: PCG_BranchConfig): Generator {
        const root = new Tree<Branch>({
            inputs: [],
            listeners: [],
            conditions: [],
        });

        const inputs: {[id: string]: IInput} = {};

        const traverse = (branch: Tree<Branch>, node: PCG_BranchConfig) => {
            for (const input of node.inputs) {
                if (IsDynamicInputConfig(input)) {
                    const dynamicInputs: GeneratorDynamicInput[] = [];
                    for (const subInput of input) {
                        const dynamicInput: GeneratorDynamicInput = {
                            input: this.CreateInput(container, subInput.input),
                            dependsOn: [],
                        }
                        inputs[subInput.input.id] = dynamicInput.input;
                        for (const dependency of subInput.dependsOn) {
                            const dependsOnInput = inputs[dependency.inputId];
                            if (!dependsOnInput) {
                                throw new Error("Input does not exist in conditional");
                            }
                            dynamicInput.dependsOn.push(this.CreateConditional(dependsOnInput, dependency));
                        }
                        dynamicInputs.push(dynamicInput);
                    }
                    branch.value.inputs.push(dynamicInputs);
                } else {
                    const inp = this.CreateInput(container, input);
                    inputs[input.id] = inp;
                    branch.value.inputs.push(inp);
                }
            }

            for (const condition of node.conditions) {
                const inp = inputs[condition.inputId];
                if (!inp) {
                    throw new Error("Input does not exist in conditional");
                }
                branch.value.conditions.push(this.CreateConditional(inp, condition));
            }

            for (const child of node.children) {
                const newBranch = new Tree<Branch>({
                    inputs: [],
                    listeners: [],
                    conditions: [],
                });
                traverse(newBranch, child);
            }
        }

        traverse(root, config);

        return new Generator(container, root, {
            format: '',
        });
    }

    private static CreateConditional(input: IInput, conditional: ConditionalConfig): IConditional {
        for (const registered of this.ConditionalFactory) {
            if (registered.name === conditional.type) {
                return registered.factory(input, conditional.options);
            }
        }
    }

    private static CreateInput(container: HTMLElement, config: InputConfig): IInput {
        for (const registered of this.InputFactory) {
            if (registered.name === config.type) {
                const input = registered.factory(container, config.options)
                if (config.dropdownOptions) {
                    input.setDropdownOptions(config.dropdownOptions);
                }
                return input;
            }
        }

        throw new Error(`Input type '${config.type} is not registered'`);
    }
}

GeneratorFactory.RegisterInput('constant', (c, o) => new Constant(c, o as ConstantOptions));
GeneratorFactory.RegisterInput('decimal', (c, o) => new Decimal(c, o as NumericOptions));
GeneratorFactory.RegisterInput('integer', (c, o) => new Integer(c, o as NumericOptions));
GeneratorFactory.RegisterInput('dropdown', (c, o) => new Dropdown(c, o));

GeneratorFactory.RegisterConditional('comparison', (i, o) => new Comparison(i, o as ComparisonOptions));
GeneratorFactory.RegisterConditional('range', (i, o) => new Range(i, o as RangeOptions));
GeneratorFactory.RegisterConditional('specific', (i, o) => new Specific(i, o as SpecificOptions));
