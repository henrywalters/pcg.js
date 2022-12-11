import {Input} from "../input";
import type {NumericOptions} from "../interface";

export class Numeric<Options extends NumericOptions = NumericOptions>  extends Input<Options>  {

    constructor(container: HTMLElement, options: Options) {
        super(container, options);
        this.setOptions(options);
    }

    protected onInit() {
        this.input.addEventListener('keyup', () => {
            this.update();
        })
    }

    protected get html(): HTMLElement {
        const input = document.createElement('input');
        input.type = "text";
        return input;
    }

    protected onOptionsChange() {
        (this.input as HTMLInputElement).step = this.getOptions().step.toString();
        (this.input as HTMLInputElement).removeAttribute('min');
        (this.input as HTMLInputElement).removeAttribute('max');

        if ('min' in this.getOptions()) {
            (this.input as HTMLInputElement).min = this.getOptions().min.toString();
        }

        if ('max' in this.getOptions()) {
            (this.input as HTMLInputElement).max = this.getOptions().max.toString();
        }
    }

    protected getRawValue() {
        return (this.input as HTMLInputElement).value;
    }

    protected validate(raw: string) {
        throw new Error("Not implemented!");
        return false;
    }

    protected getRangeErrors(value: number): string[] {
        const hasMin = 'min' in this.getOptions();
        const hasMax = 'max' in this.getOptions();

        const outOfRange = hasMin && hasMax && value < this.getOptions().min && value > this.getOptions().max;
        const below = hasMin && value < this.getOptions().min;
        const above = hasMax && value > this.getOptions().max;

        if (outOfRange) {
            return ["Must be between " + this.getOptions().min + " and " + this.getOptions().max]
        } else if (above) {
            return ["Must be less than " + this.getOptions().max];
        } else if (below) {
            return ["Must be greater than " + this.getOptions().min];
        }

        return [];

    }

    padFront(value: string, length: number) {
        for (let i = 0; i < length; i++) {
            value = "0" + value;
        }
        return value;
    }

    padBack(value: string, length: number) {
        for (let i = 0; i < length; i++) {
            value = value + "0";
        }
        return value;
    }
}
