import L from "leaflet";
import { Point } from "../connection/connection";
import { Colors } from "./Colors";

const serverPath = "https://system-routes.herokuapp.com";


interface Concession_ {
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
interface Route {
    id: number,
    latitude: number,
    longitude: number,
}

// /coordinate?concession=___
interface ConcessionView {
    startDay: string,
    endDay: string,
    startTime: number,
    endTime: number,
}

// /coordinate?view=___
interface AllBusStop {
    name: string,
    latitude: number,
    longitude: number,
}

/** A concession represents the routes of buses */
export class Concession {
    /** Id of the concession */
    public readonly id: number;
    /** Name of the concession */
    public readonly name: string;

    /**
     * Color of the path, generated automatically.
     * @private
     */
    private readonly color: string;

    /**
     * Stores the line draw it the map. If null, it has not been drawn yet.
     * @private
     */
    private polyline: L.Polyline | null = null;

    /**
     * Whether this path is hidden in the map
     * @private
     */
    private hidden = true;

    /**
     * A collection of points, unique for each concession.
     * These are fetched from the server, then drawn.
     * @private
     */
    private route: Array<Route> | null = null;

    /**
     * A reference to the Map in which to draw the path
     * @private
     */
    private readonly map: L.Map;

    constructor(id: number, name: string, map: L.Map) {
        this.id = id;
        this.name = name;
        this.color = Colors.next();

        this.map = map;
    }

    /**
     * Draws the route as a Polyline.
     * Assumes the route has already been fetched from the server
     * @private
     */
    private draw() {
        if (this.route === null) {
            throw new Error("Attempted to draw line without route.");
        }

        const arr = Concession.routeArrayToLatLngArray(this.route);
        console.log(`Polyline for ${this.id}`);
        console.log(JSON.stringify(arr));
        // draw
        this.polyline = L.polyline(arr, {color: this.color});
        this.polyline.addTo(this.map);
    }

    /**
     * Gets the route from the server
     * @private
     */
    private async fetchPath() {
        const pathsRaw = await fetch(`${serverPath}/coordinate?concession=${this.id}`);
        this.route = await pathsRaw.json() as Array<Route>;
    }

    public async show() {
        console.log(`Show route for ${this.id}`);

        if (this.route === null) {
            console.log(`Fetching route for ${this.id}`);
            await this.fetchPath();
        }

        if (this.polyline === null) {
            console.log(`Draw polyline for ${this.id}`);
            this.draw();
        }

        this.polyline!.setStyle({
            opacity: 1,
        });
        this.hidden = false;
    }

    public async hide() {
        console.log(`Hide path for ${this.id}`);

        if (this.route === null) {
            console.log(`Fetching route for ${this.id}`);
            await this.fetchPath();
        }

        if (this.polyline === null) {
            console.log(`Draw polyline for ${this.id}`);
            this.draw();
        }

        this.polyline!.setStyle({
            opacity: 0,
        });
        this.hidden = true;
    }

    public remove() {
        this.polyline?.remove();
    }

    private static routeArrayToLatLngArray(routeArray: Array<Route>): Array<L.LatLngExpression> {
        return routeArray.map((route) => [route.latitude, route.longitude]);
    }
}

/** A company provides transportation services. E.g. "06 de diciembre" */
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

    /**
     * Removes this provider from the map. This object shouldn't be used afterwards.
     */
    public remove() {
        this.concessions.forEach((c) => c.remove());
    }
}

export type RawProviderArr = Array<Company_>

export class ProviderManagerBuilder {
    private providerManagerInstance: ProviderManager | null = null;
    protected hasBeenInstantiated = false;

    /**
     * Sets the map to be used in the ProviderManager.
     * @param map
     */
    setMap(map: L.Map): this {
        console.log("Set map...");
        if (this.providerManagerInstance !== null) {
            console.log("Map already set...");
            return this;
        }

        this.providerManagerInstance = new ProviderManager(map);
        this.hasBeenInstantiated = true;
        return this;
    }

    /**
     * Builds the ProviderManager
     */
    build(): ProviderManager {
        if (!this.hasBeenInstantiated) {
            throw new Error("Tried to build a ProviderManager without setting the map.");
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.providerManagerInstance!;
    }

    private waitForInstance() {
        return new Promise<void>((resolve) => {
            let interval = 0;
            interval = setInterval(() => {
                if (this.hasBeenInstantiated) {
                    clearInterval(interval);
                    resolve();
                }
            }, 250);
        });
    }

    /**
     * Tries to get the ProviderManager every 250ms. Another component should
     * call `setMap()` and `build()` beforehand.
     */
    async getInstance(): Promise<ProviderManager> {
        await this.waitForInstance();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.providerManagerInstance!;
    }

    public hasInstance(): boolean {
        return this.hasBeenInstantiated;
    }
}

export class ProviderManager {
    private readonly providers: Map<number, Company> = new Map();

    private readonly map: L.Map;

    constructor(map: L.Map) {
        this.map = map;
        // Debug
        console.log("Add map for debug - ProviderManager::constructor");
        /// @ts-ignore
        window.cmap = map;
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
