import L from "leaflet";
import { Point } from "../connection/connection";
import { Colors } from "./Colors";

const serverPath = "https://system-routes.herokuapp.com/route";

class Provider {
    /**
     * Unique identifier of the provider
     * @private
     */
    private readonly id: number;
    /**
     * Name of the provider
     */
    readonly definition: string;
    /**
     * Map to draw to the path of the provider
     * @private
     */
    private readonly map: L.Map;
    /**
     * Array of dots that form a path
     * @private
     */
    private path: Array<L.LatLngExpression> = [];
    /**
     * Color of the path, generated automatically
     * @private
     */
    private readonly color: string;
    /**
     * Stores the line draw it the map. If null, it has not been drawn yet.
     * @private
     */
    private polyline: L.Polyline | null = null;
    /**
     * Whether this provider's path is hidden in the map
     * @private
     */
    private hidden = false;

    constructor(map: L.Map, param: { id: number, definition: string }) {
        this.id = param.id;
        this.definition = param.definition;
        this.map = map;
        this.color = Colors.next();

        this.setup();
    }

    /**
     * Initializes the path of this provider
     * @private
     */
    private async setup() {
        await this.fetchPath();
        this.draw();
    }

    private async fetchPath() {
        const pathsRaw = await fetch(`${serverPath}/graphics?companyId=${this.id}`);
        const points = await pathsRaw.json() as Array<Point>;
        this.path = points.map((point): L.LatLngExpression => [point.latitude, point.longitude]);
    }

    private draw() {
        this.polyline = L.polyline(this.path, {color: this.color})
            .addTo(this.map);
    }

    /**
     * Hides this line from the map
     */
    public toggleHide() {
        console.log("Toggle hide path for", this.id);
        if (this.polyline === null) {
            console.log("Polyline for", this.id, "is not initialized");
            return;
        }
        if (this.hidden) {
            this.polyline.setStyle({
                opacity: 1,
            });
        } else {
            this.polyline.setStyle({
                opacity: 0,
            });
        }
        this.hidden = !this.hidden;
    }

    /**
     * Removes this provider from the map. This object shouldn't be used afterwards.
     */
    public remove() {
        this.polyline?.remove();
    }
}

type RawProviderArr = Array<{
    id: number,
    definition: string,
}>

export class ProviderManagerBuilder {
    private providerManagerInstance: ProviderManager | null = null;
    protected hasBeenInstantiated = false;

    /**
     * Sets the map to be used in the ProviderManager.
     * @param map
     */
    setMap(map: L.Map): this {
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
}

export class ProviderManager {
    private readonly providers: Map<number, Provider> = new Map();

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
                this.providers.get(provider.id)?.remove();
            }

            const newProvider = new Provider(this.map, provider);
            this.providers.set(provider.id, newProvider);
        }
    }

    public getById(id: number): Provider | null {
        return this.providers.get(id) ?? null;
    }
}
