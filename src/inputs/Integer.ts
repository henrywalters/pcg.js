import Type from "hcore/dist/type";
import {Numeric} from "./numeric";

export class Integer extends Numeric {

    protected validate(raw: string) {
        if (!Type.isInt(raw)) {

            this.errorMessage = "Invalid Integer";
            return false;
        }

        const value = parseInt(raw);

        let errors = this.getRangeErrors(value);

        if (this.getOptions().step && value % this.getOptions().step !== 0) {
            errors.push("Must be an increment of " + this.getOptions().step);
        }

        this.errorMessage = errors.join("<br/>");

        return errors.length === 0;
    }

    format( raw: string) {
        if (raw.trim() === "") {
            return "";
        }

        const value = parseInt(raw).toString();

        if (!('minDigits' in this.getOptions())) {
            return value;
        }

        return this.padFront(value, this.getOptions().minDigits - value.length)
    }
}
