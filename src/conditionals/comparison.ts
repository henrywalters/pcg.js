import {Conditional} from "../conditional";
import type {ComparisonOptions, IInput} from "../interface";

export enum ComparisonType {
    Equal = '=',
    GreaterThan = '>',
    GreaterThanOrEqual = '>=',
    LessThan = '<',
    LessThanOrEqual = '<=',
}

export class Comparison extends Conditional<ComparisonOptions> {

    constructor(input: IInput, options: ComparisonOptions) {
        super(input, options);
    }

    public check(value: string): boolean {
        const parsed = parseFloat(value);
        switch (this.options.type) {
            case ComparisonType.Equal:
                return parsed === this.options.value;
            case ComparisonType.GreaterThan:
                return parsed > this.options.value;
            case ComparisonType.GreaterThanOrEqual:
                return parsed >= this.options.value;
            case ComparisonType.LessThan:
                return parsed < this.options.value;
            case ComparisonType.LessThanOrEqual:
                return parsed <= this.options.value;
        }
    }
}
