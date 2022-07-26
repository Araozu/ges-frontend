import L from "leaflet";
import { ProviderManager } from "./ProviderManager";

/**
 * Used to build and access the instance of ProviderManager
 */
export class ProviderManagerBuilder {
    private providerManagerInstance: ProviderManager | null = null;
    protected hasBeenInstantiated = false;

    /**
     * Sets the map to be used in the ProviderManager.
     * @param map
     */
    setMap(map: L.Map): this {
        if (this.providerManagerInstance !== null) {
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
