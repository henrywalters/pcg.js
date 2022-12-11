import type {PCG_BranchConfig} from "./interface";
import {ComparisonType} from "./conditionals/comparison";

export const SAMPLE_CONFIG: PCG_BranchConfig = {
    inputs: [
        {
            id: 'age',
            type: 'integer',
            options: {
                label: "Age", step: 1, min: 0, max: 99, minDigits: 2,
            }
        },
        [
            {
                input: {
                    id: 'like_to_drink',
                    type: 'dropdown',
                    options: {
                        label: "Like to drink?",
                    },
                    dropdownOptions: [
                        {
                            label: "Yes",
                            value: "1"
                        },
                        {
                            label: "No",
                            value: "0"
                        }
                    ],
                },
                dependsOn: [
                    {
                        inputId: 'age',
                        type: 'comparison',
                        options: {
                            type: ComparisonType.GreaterThanOrEqual,
                            value: 21,
                        }
                    }
                ]
            },
            {
                input: {
                    id: 'like_to_drink_default',
                    type: 'constant',
                    options: {
                        label: "Like to Drink?",
                        value: "0"
                    }
                },
                dependsOn: [
                    {
                        inputId: 'age',
                        type: 'comparison',
                        options: {
                            type: ComparisonType.LessThan,
                            value: 21,
                        }
                    }
                ]
            }
        ],
        [
            {
                input: {
                    id: 'drinks_per_week',
                    type: 'integer',
                    options: {
                        label: 'Drinks per Week',
                        min: 0,
                        max: 999,
                        step: 1,
                        minDigits: 3,
                    }
                },
                dependsOn: [
                    {
                        inputId: 'age',
                        type: 'comparison',
                        options: {
                            type: ComparisonType.GreaterThanOrEqual,
                            value: 21,
                        }
                    },
                    {
                        inputId: 'like_to_drink',
                        type: 'specific',
                        options: {
                            results: ['1'],
                        }
                    }
                ]
            },
            {
                input: {
                    id: 'drinks_per_week_default_1',
                    type: 'constant',
                    options: {
                        label: 'Drinks per Week',
                        value: '000',
                    }
                },
                dependsOn: [
                    {
                        inputId: 'age',
                        type: 'comparison',
                        options: {
                            type: ComparisonType.GreaterThanOrEqual,
                            value: 21,
                        }
                    },
                    {
                        inputId: 'like_to_drink',
                        type: 'specific',
                        options: {
                            results: ['0'],
                        }
                    }
                ]
            },
            {
                input: {
                    id: 'drinks_per_week_default_1',
                    type: 'constant',
                    options: {
                        label: 'Drinks per Week',
                        value: '000',
                    }
                },
                dependsOn: [
                    {
                        inputId: 'age',
                        type: 'comparison',
                        options: {
                            type: ComparisonType.LessThan,
                            value: 21,
                        }
                    }
                ]
            }
        ]
    ],
    children: [],
    conditions: [],
};
