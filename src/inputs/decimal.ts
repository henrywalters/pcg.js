import Type from "hcore/dist/type";
import {Numeric} from "./numeric";

export class Decimal extends Numeric {

    validate(raw: string) {

        if (!(Type.isInt(raw) || Type.isFloat(raw))) {
            this.errorMessage = "Invalid decimal";
            return false;
        }

        if (raw.trim() === '') return true;

        const value = parseFloat(raw);

        const errors = this.getRangeErrors(value);

        if (this.getOptions().step && Math.abs((value / this.getOptions().step) - Math.round(value / this.getOptions().step)) > 0.0001) {
            errors.push("Must be a multiple of " + this.getOptions().step);
        }

        this.errorMessage = errors.join('<br />');

        return errors.length === 0;
    }


    format( raw: string) {
        if (raw.trim() === "") {
            return "";
        }

        const value = parseFloat(raw).toString();

        let parts = value.split('.');

        if (!('minDigits' in this.getOptions())) {
            return parts.length === 2 ? parts[0] + parts[1] : parts[0];
        }

        if (parts.length === 0) {
            return "";
        } else if (parts.length === 1) {
            return this.padFront(parts[0], this.getOptions().minDigits - parts[0].length)
        } else {
            return this.padFront(parts[0] + parts[1],this.getOptions().minDigits - parts[0].length - parts[1].length);
        }
    }
}
