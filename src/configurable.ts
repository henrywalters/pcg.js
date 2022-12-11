export class Configurable<Options> {
    private _options: Options;

    constructor(options: Options) {
        this.options = options;
    }

    protected onOptionsChange() {}

    public set options(options: Options) {
        this._options = options;
        this.onOptionsChange();
    }

    public get options() {
        return this._options;
    }
}