import {Conditional} from "../conditional";
import type {IInput, RangeOptions} from "../interface";

export enum RangeType {
    Inclusive = 'inclusive',
    Exclusive = 'exclusive',
}

export class Range extends Conditional<RangeOptions> {

    constructor(input: IInput, options: RangeOptions) {
        super(input, options);
    }

    public check(value: string): boolean {
        const parsed = parseFloat(value);
        switch (this.options.type) {
            case RangeType.Exclusive:
                return parsed > this.options.min && parsed < this.options.max;
            case RangeType.Inclusive:
                return parsed >= this.options.min && parsed <= this.options.max;
        }
    }
}
