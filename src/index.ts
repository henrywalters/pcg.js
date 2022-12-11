import {GeneratorFactory} from "./generatorFactory";
import type {PCG_GeneratorConfig} from "./interface";

export {GeneratorFactory} from "./generatorFactory";

export const PCG_API_ROOT = "http://localhost:3000/api";

export async function LoadGeneratorFromAPI(slug: string, apiKey: string): Promise<PCG_GeneratorConfig> {
    const url = `${PCG_API_ROOT}/generator/${encodeURIComponent(slug)}?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Status: ${res.status} Error: ${res.statusText}`);
    }
    return await res.json();
}
