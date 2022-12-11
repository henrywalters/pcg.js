import {Random} from "hcore/dist/random";
import EventListenerPool from "hcore/dist/eventListenerPool";
import {ClassNames, InputState} from "./interface";
import type {DropdownOption, IInput, InputOptions} from "./interface";
import {SAFE_ID_SIZE} from "hcore/dist/constants";

export class Input<Options extends InputOptions = InputOptions> implements IInput {

    public readonly id: string;

    protected readonly input: HTMLElement;
    protected errorMessage: string = "";

    private readonly div: HTMLDivElement;
    private readonly error: HTMLParagraphElement;
    private readonly label: HTMLParagraphElement;

    private _raw: string = "";
    private _parsed: string = "";

    private _visible: boolean = true;

    private _state: InputState = InputState.Empty;

    private _options: Options;
    private _dropdownOptions: DropdownOption[] = [];

    public readonly onChange: EventListenerPool<string> = new EventListenerPool<string>();

    constructor(container: HTMLElement, options: Options) {

        if (!container) {
            throw new Error("Container does not exist");
        }

        this._options = options;
        this.id = Random.alphanumeric(SAFE_ID_SIZE);
        this.div = document.createElement('div');
        this.div.classList.add(ClassNames.InputContainer);
        this.div.id = this.id;
        this.label = document.createElement('p');
        this.label.classList.add(ClassNames.Label);
        this.label.innerHTML = options.label;
        this.error = document.createElement('p');
        this.error.classList.add(ClassNames.Error);
        this.error.style.display = "none";
        this.input = this.html;
        this.input.classList.add(InputState.Empty);
        this.input.classList.add(ClassNames.Input);

        this.div.appendChild(this.label);
        this.div.appendChild(this.input);
        this.div.appendChild(this.error);

        container.appendChild(this.div);

        this.onInit();
    }

    getRaw(): string {
        return this._raw;
    }
    getParsed(): string {
        return this._parsed;
    }
    getState(): InputState {
        return this._state;
    }

    getOptions(): Options {
        return this._options;
    }

    isVisible(): boolean {
        return this._visible;
    }

    public setOptions(options: Options) {
        this._options = options;
        this.onOptionsChange();
    }

    public getDropdownOptions(): DropdownOption[] {
        return this._dropdownOptions;
    }

    public setDropdownOptions(options: DropdownOption[]) {
        this._dropdownOptions = options;
        this.onDropdownOptionsChange();
    }

    public setLabel(label: string) {
        this.label.innerText = label;
    }

    public show() {
        this._visible = true;
        this.div.style.display = "block";
    }

    public hide() {
        this._visible = false;
        this.div.style.display = "none";
    }

    public update() {
        const raw = this.getRawValue();

        if (raw === this._raw) {
            return;
        }

        this._raw = raw;

        this.onUpdate();
        this.error.innerText = "";

        if (raw.trim() === "") {
            this.hideError();
            this._parsed = "";
            this.setState(InputState.Empty);
            this.onChange.emit("");
            return;
        }

        if (this.validate(raw)) {
            this.hideError();
            this._parsed = this.format(raw);
            this.setState(InputState.Valid);
            this.onSuccess();
            this.onChange.emit(this._parsed);
        } else {
            this.error.innerHTML = this.errorMessage;
            this.setState(InputState.Invalid);
            this.showError();
            this.onError();
            this.onChange.emit("");
        }
    }

    public remove() {
        this.div.parentNode.removeChild(this.div);
    }

    protected get html(): HTMLElement {
        const input = document.createElement('input');
        input.type = "text";
        return input;
    }

    protected getRawValue(): string {
        throw new Error("Get Raw Value Not implemented");
    }

    protected validate(raw: string): boolean {
        return true;
    }

    protected format(raw: string): string {
        return raw;
    }

    protected onOptionsChange() {

    }

    protected onDropdownOptionsChange() {

    }

    protected onInit() {

    }

    protected onUpdate() {

    }

    protected onError() {

    }

    protected onSuccess() {

    }

    private hideError() {
        this.error.style.display = "none";
    }

    private showError() {
        this.error.style.display = "block";
    }

    private setState(state: InputState) {
        if (state === this.getState()) return;

        this.input.classList.remove(this.getState());
        this.input.classList.add(state);

        this._state = state;
    }
}
