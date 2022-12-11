import {Input} from "../input";
import type {ConstantOptions} from "../interface";
import {ClassNames} from "../interface";

export class Constant<Options extends ConstantOptions = ConstantOptions> extends Input<Options> {
    constructor(container: HTMLElement, options: Options) {
        super(container, options);
        this.setOptions(options);
    }

    protected onInit() {
        this.update();
    }

    protected get html(): HTMLElement {
        const input = document.createElement('input');
        const options = this.getOptions();
        input.disabled = true;
        input.value = options.displayValue ? options.displayValue : options.value;
        input.classList.add(ClassNames.Disabled);
        return input;
    }

    protected onOptionsChange() {
        const options = this.getOptions();
        (this.input as HTMLInputElement).value = options.displayValue ? options.displayValue : options.value;;
        this.update();
    }

    protected getRawValue() {
        return this.getOptions().value;
    }

    protected validate(raw: string) {
        return true;
    }
}
