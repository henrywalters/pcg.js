import {Input} from "../input";

export class Dropdown extends Input {

    protected get html(): HTMLElement {
        const input = document.createElement('select');
        for (const option of this.getDropdownOptions()) {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.innerText = option.label;
            input.appendChild(opt);
        }
        return input;
    }

    protected onInit() {
        this.input.addEventListener('change', () => {
            this.update();
        })
    }

    protected onOptionsChange() {

    }

    protected onDropdownOptionsChange() {
        this.input.innerHTML = '';
        this.addOption('', '');
        for (const option of this.getDropdownOptions()) {
            this.addOption(option.label, option.value);
        }
    }

    protected getRawValue() {
        return (this.input as HTMLInputElement).value;
    }

    protected validate(raw: string) {
        return true;
    }

    private addOption(label: string, value: string) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.innerText = label;
        this.input.appendChild(opt);
    }

}
