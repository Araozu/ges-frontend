import { Concession } from "./Concession";
import L from "leaflet";
import { Concession_ } from "./ProviderManager";

/**
 * A company provides transportation services. E.g. "06 de diciembre"
 */
export class Company {
    /**
     * Unique identifier of the company
     * @private
     */
    public readonly id: number;
    /**
     * Name of the company
     */
    public readonly name: string;

    public readonly concessions: Array<Concession>;

    constructor(map: L.Map, param: { id: number, name: string, allConcession: Array<Concession_> }) {
        this.id = param.id;
        this.name = param.name;

        this.concessions = param.allConcession.map((c) => new Concession(c.id, c.name, map));
    }

    public getConcessiongById(concessionId: number): Concession | null {
        return this.concessions.find((c) => c.id === concessionId) ?? null;
    }

    public getConcessiongByName(concessionName: string): Concession | null {
        return this.concessions.find((c) => c.name === concessionName) ?? null;
    }

    public activateAll() {
        setTimeout(() => {
            for (const c of this.concessions) {
                c.show();
            }
        }, 250);
    }

    /**
     * Removes this provider from the map. This object shouldn't be used afterwards.
     */
    public remove() {
        this.concessions.forEach((c) => c.remove());
    }
}
