import type {Conditional} from "./conditional";
import type EventListenerPool from "hcore/dist/eventListenerPool";
import type {EventListener} from "hcore/dist/eventListenerPool";
import type {ComparisonType} from "./conditionals/comparison";
import type {RangeType} from "./conditionals/range";

export interface InputOptions {
    label: string;
}

export interface NumericOptions extends InputOptions {
    step: number;
    min?: number;
    max?: number;
    minDigits?: number;
}

export interface ConstantOptions extends InputOptions {
    value: string;
    displayValue?: string;
}

export enum ClassNames {
    Input= 'pcg-input',
    InputContainer = 'pcg-input-container',
    Error = 'pcg-error',
    Label = 'pcg-label',
    Disabled = 'pcg-disabled',
    Horizontal = 'pcg-horizontal',
    Vertical = 'pcg-vertical',
}

export enum InputState {
    Empty = 'pcg-empty',
    Valid = 'pcg-valid',
    Invalid = 'pcg-invalid',
}

export enum Direction {
    Vertical = 'vertical',
    Horizontal = 'horizontal',
}

export interface DropdownOption {
    label: string;
    value: string;
}

export interface IInput {
    id: string;
    onChange: EventListenerPool<string>;
    getRaw(): string;
    getParsed(): string;
    getState(): InputState;
    getOptions(): InputOptions;
    setOptions(options: InputOptions);
    getDropdownOptions(): DropdownOption[];
    setDropdownOptions(options: DropdownOption[]);
    update(): void;
    hide();
    show();
    isVisible(): boolean;
}

export type InputFactoryFn = (container: HTMLElement, options: InputOptions) => IInput;

export type ConditionalFactoryFn = (input: IInput, options: ConditionalOptions) => IConditional;

export type InputFactory = {
    name: string;
    factory: InputFactoryFn;
}

export type ConditionFactory = {
    name: string;
    factory: ConditionalFactoryFn;
}

export interface IGenerator {
    getActiveInputs(): GeneratorInput[];
}

export interface IFormatter {
    format(inputs: GeneratorInput[]): string;
}

export interface GeneratorOptions {

}

export interface FormatterOptions {
    format: string;
}

export interface GeneratorDynamicInput {
    input: IInput;
    dependsOn: IConditional[];
}

export type GeneratorInput = IInput | GeneratorDynamicInput[];

export function IsDynamicInput(input: GeneratorInput): input is GeneratorDynamicInput[] {
    return Array.isArray(input);
}

export interface IConditional {
    input: IInput;
    check(value: string): boolean;
}

export interface ConditionalOptions {

}

export interface ComparisonOptions extends ConditionalOptions {
    type: ComparisonType;
    value: number;
}

export interface RangeOptions extends ConditionalOptions {
    type: RangeType;
    min: number;
    max: number;
}

export interface SpecificOptions extends ConditionalOptions {
    results: string[];
}


export interface Branch {
    inputs: GeneratorInput[];
    conditions: IConditional[];
    listeners: EventListener<string>[];
}

export interface InputConfig {
    id: string | number;
    type: string;
    options: InputOptions | NumericOptions | ConstantOptions;
    dropdownOptions?: DropdownOption[];
}

export interface ComparisonConfig {
    value: number;
    type: ComparisonType;
}

export interface RangeConfig {
    min: number;
    max: number;
    inclusive: boolean;
}

export interface SpecificConfig {
    results: string[];
}

export interface ConditionalConfig {
    type: string;
    inputId: string | number;
    options: ComparisonConfig | RangeConfig | SpecificConfig;
}

export interface GeneratorDynamicInputConfig {
    input: InputConfig;
    dependsOn: ConditionalConfig[];
}

export interface GeneratorOptions {
    format: string;
}

export interface IEmailer {

}

export interface IFileDownloader {

}

export interface ICodeConverter {

}

export interface EmailOptions {

}

export interface FileDownloadOptions {

}

export interface CodeConverterOptions {

}

export type GeneratorInputConfig = InputConfig | GeneratorDynamicInputConfig[];

export function IsDynamicInputConfig(input: GeneratorInputConfig): input is GeneratorDynamicInputConfig[] {
    return Array.isArray(input);
}

export interface PCG_BranchConfig {
    inputs: GeneratorInputConfig[];
    conditions: ConditionalConfig[];
    children: PCG_BranchConfig[];
}

export interface PCG_GeneratorConfig extends PCG_BranchConfig {
    options: GeneratorOptions;
}
