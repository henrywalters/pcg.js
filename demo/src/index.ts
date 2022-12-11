import {LoadGeneratorFromAPI, GeneratorFactory} from "pcg";
import {Generator} from "pcg/dist/generator";
import {Formatter} from "pcg/dist/formatter";
import {EventListener} from "hcore/dist/eventListenerPool";
import {IInput} from "pcg/dist/interface";

let apiKey: HTMLInputElement;
let slug: HTMLInputElement;
let output: HTMLDivElement;
let loading: HTMLParagraphElement;
let error: HTMLParagraphElement;
let codeContainer: HTMLDivElement;
let code: HTMLSpanElement;

let generator: Generator;
let formatter: Formatter

let invalidListener: EventListener<void>;
let validListener: EventListener<IInput[]>;

function hide(el: HTMLElement) {
    el.classList.add("hidden");
}

function show(el: HTMLElement) {
    el.classList.remove("hidden");
}

async function load() {
    show(loading);
    hide(error);
    try {
        output.innerHTML = "";
        const config = await LoadGeneratorFromAPI(slug.value, apiKey.value);
        generator = GeneratorFactory.Create(output, config);
        formatter.options = config.options;
        generator.update();

        if (validListener) {
            generator.onValidCode.remove(validListener);
            generator.onInvalidCode.remove(invalidListener);
        }

        validListener = generator.onValidCode.listen((inputs) => {
            show(codeContainer);
            code.innerHTML = formatter.format(inputs);
        });

        invalidListener = generator.onInvalidCode.listen(() => {
            hide(codeContainer);
        });

    } catch (e) {
        console.log(e);
        error.innerHTML = e.message;
        show(error);
    }

    hide(loading);
}

async function main() {

    apiKey = document.getElementById('key') as HTMLInputElement;
    slug = document.getElementById('slug') as HTMLInputElement;
    output = document.getElementById('generator') as HTMLDivElement;
    loading = document.getElementById('loading') as HTMLParagraphElement;
    error = document.getElementById('error') as HTMLParagraphElement;
    code = document.getElementById('code') as HTMLSpanElement;
    codeContainer = document.getElementById('code-container') as HTMLDivElement;

    formatter = new Formatter({format: ''});

    document.getElementById('submit').addEventListener('click', () => {
        load();
    });

    load();
}

main();