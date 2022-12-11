import type {FormatterOptions, IFormatter, IInput} from "./interface";
import {Random} from "hcore/dist/random";
import {SAFE_ID_SIZE} from "hcore/dist/constants";
import Type from "hcore/dist/type";
import {Configurable} from "./configurable";

enum PartType {
    Placeholder,
    Dynamic,
}

type Placeholder = {
    value: string;
}

type Dynamic = {
    index: number;
}

interface Part {
    type: PartType,
    id: string;
}

export class Formatter<Options extends FormatterOptions = FormatterOptions> extends Configurable<Options> implements IFormatter {

    private placeholders: {[id: string]: Placeholder} = {};
    private dynamics: {[id: string]: Dynamic} = {};
    private formatParts: Part[] = [];

    constructor(options: Options) {
        super(options);
    }

    protected onOptionsChange() {
        this.parseFormatString(this.options.format);
    }

    format(inputs: IInput[]): string {
        let output = "";
        for (const part of this.formatParts) {
            if (part.type === PartType.Placeholder) {
                output += this.placeholders[part.id].value;
            } else {
                if (this.dynamics[part.id].index >= inputs.length) {
                    throw new Error("Format index is greater than inputs");
                }

                output += inputs[this.dynamics[part.id].index].getParsed();
            }
        }
        return output;
    }


    private parseFormatString(format: string) {

        this.placeholders = {};
        this.dynamics = {};
        this.formatParts = [];

        const regex = /\{\d+}/g;
        let match: RegExpExecArray;
        let startIdx = 0;

        while ((match = regex.exec(format))) {
            if (startIdx !== match.index) {
                const id = Random.alphanumeric(SAFE_ID_SIZE);
                this.placeholders[id] = {
                    value: format.slice(startIdx, match.index),
                };

                this.formatParts.push({
                    id,
                    type: PartType.Placeholder,
                })
            }

            const indexPart = match[0].slice(1, match[0].length - 1);

            if (!Type.isInt(indexPart)) {
                throw new Error("Index of dynamic value must be an integer");
            }
            const id = Random.alphanumeric(SAFE_ID_SIZE);
            this.dynamics[id] = {
                index: parseInt(indexPart),
            };

            this.formatParts.push({
                id,
                type: PartType.Dynamic,
            })

            startIdx = match.index + match[0].length;
        }

        if (startIdx !== format.length - 1) {
            const id = Random.alphanumeric(SAFE_ID_SIZE);
            this.placeholders[id] = {
                value: format.slice(startIdx, format.length),
            };

            this.formatParts.push({
                id,
                type: PartType.Placeholder,
            })
        }
    }
}
