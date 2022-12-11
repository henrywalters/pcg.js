import type {ConditionalOptions, IConditional, IInput} from "./interface";
import {Configurable} from "./configurable";

export class Conditional<Options extends ConditionalOptions = ConditionalOptions> extends Configurable<Options> implements IConditional {

    public readonly input: IInput;

    constructor(input: IInput, options: Options) {
        super(options);
        this.input = input;
    }

    public check(value: string): boolean {
        throw new Error("Unimplemented");
        return false;
    }
}
