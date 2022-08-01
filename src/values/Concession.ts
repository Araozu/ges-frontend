import L from "leaflet";
import { Colors } from "./Colors";
import { serverPath } from "./Constants";
import { Route } from "./ProviderManager";
import { AllBusStop, AllHorary } from "./RemoteInterfaces";


export interface ConcessionAdditionalInfo {
    allHorary: Array<AllHorary>,
    allBusStop: Array<AllBusStop>,
}

/**
 * A concession represents the routes of buses
 */
export class Concession {
    /** Id of the concession */
    public readonly id: number;
    /** Name of the parent company */
    public readonly name: string;
    /** Name of the concession */
    public readonly company: string;

    /**
     * Color of the path, generated automatically.
     * @private
     */
    public readonly color: string = Colors.next();

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

    /**
     * Contains information about bus stops and schedules.
     * It's only populated when requested via the method loadAdditionalInfo.
     * @private
     */
    private additionalInfo: ConcessionAdditionalInfo | null = null;

    constructor(id: number, name: string, company: string, map: L.Map) {
        this.id = id;
        this.name = name;
        this.company = company;

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
        console.log(`Concession.show - route for ${this.id}`);

        if (this.route === null) {
            console.log(`Concession.show - fetching route for ${this.id}`);
            await this.fetchPath();
        }

        if (this.polyline === null) {
            console.log(`Concession.show - draw polyline for ${this.id}`);
            this.draw();
        }

        this.polyline!.setStyle({
            opacity: 1,
        });
        this.hidden = false;
    }

    public async hide() {
        console.log(`Concession.hide - Hide path for ${this.id}`);

        if (this.route === null) {
            console.log(`Concession.hide - Fetching route for ${this.id}`);
            await this.fetchPath();
        }

        if (this.polyline === null) {
            console.log(`Concession.hide - Draw polyline for ${this.id}`);
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

    public async loadAdditionalInfo(): Promise<ConcessionAdditionalInfo> {
        if (this.additionalInfo !== null) {
            return this.additionalInfo!;
        }

        const response = await fetch(`${serverPath}/concession/view?id=${this.id}`);
        const obj = await response.json();

        const additionalInfo = {
            allHorary: obj.allHorary,
            allBusStop: obj.allBusStop,
        };

        this.additionalInfo = additionalInfo;
        return additionalInfo;
    }
}
