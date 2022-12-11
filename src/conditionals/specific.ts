import {Conditional} from "../conditional";
import type {IInput, SpecificOptions} from "../interface";

export class Specific extends Conditional<SpecificOptions> {

    constructor(input: IInput, options: SpecificOptions) {
        super(input, options);
    }

    public check(value: string): boolean {
        return this.options.results.indexOf(value) !== -1;
    }
}
