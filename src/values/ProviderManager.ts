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

const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export type RawProviderArr = Array<Company_>

/**
 * Contains references to all the Company and their ids.
 */
export class ProviderManager {
    private readonly providers: Map<number, Company> = new Map();
    private originPoint: L.Marker | null = null;
    private targetPoint: L.Marker | null = null;

    public readonly map: L.Map;

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

    public getCompanyByConcessionId(concessionId: number): Company | null {
        for (const company of this.getAll()) {
            const concession = company.getConcessiongById(concessionId);
            if (concession !== null) {
                return company;
            }
        }

        return null;
    }

    public getConcessionById(concessionId: number): Concession | null {
        for (const company of this.getAll()) {
            const concession = company.getConcessiongById(concessionId);
            if (concession !== null) {
                return concession;
            }
        }

        return null;
    }

    public getCompanyByConcessionName(concessionName: string): Company | null {
        for (const company of this.getAll()) {
            const concession = company.getConcessiongByName(concessionName);
            if (concession !== null) {
                return company;
            }
        }

        return null;
    }

    public setOriginPinpoint(point: [number, number]) {
        if (this.originPoint !== null) {
            this.originPoint.setLatLng(point);
        } else {
            const newPoint = new L.Marker(point, {
                title: "Origen",
            });
            newPoint.addTo(this.map);
            this.originPoint = newPoint;
        }
    }

    public setTargetPinPoint(point: [number, number]) {
        if (this.targetPoint !== null) {
            this.targetPoint.setLatLng(point);
        } else {
            const newPoint = new L.Marker(point, {
                title: "Destino",
                icon: greenIcon,
            });
            newPoint.addTo(this.map);
            this.targetPoint = newPoint;
        }
    }
}
