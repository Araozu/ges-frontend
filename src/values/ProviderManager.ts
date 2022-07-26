import L from "leaflet";
import { Concession } from "./Concession";
import { Company } from "./Company";


export interface Concession_ {
    id: number,
    name: string,
}

// /company
export interface Company_ {
    id: number,
    name: string,
    allConcession: Array<Concession>,
}

// /route?id=___
export interface Route {
    id: number,
    latitude: number,
    longitude: number,
}


export type RawProviderArr = Array<Company_>

/**
 * Contains references to all the Company and their ids.
 */
export class ProviderManager {
    private readonly providers: Map<number, Company> = new Map();

    private readonly map: L.Map;

    constructor(map: L.Map) {
        this.map = map;
    }

    /**
     * Updates the providers.
     * @param providersInfo
     */
    public update(providersInfo: RawProviderArr) {
        for (const provider of providersInfo) {
            if (this.providers.has(provider.id)) {
                this.providers.get(provider.id)
                    ?.remove();
            }

            const newProvider = new Company(this.map, provider);
            this.providers.set(provider.id, newProvider);
        }
    }

    public getById(id: number): Company | null {
        return this.providers.get(id) ?? null;
    }

    public getAll(): Array<Company> {
        return Array.from(this.providers.values());
    }
}
