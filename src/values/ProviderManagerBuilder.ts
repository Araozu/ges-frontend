import L from "leaflet";
import { ProviderManager } from "./ProviderManager";

/**
 * Used to build and access the instance of ProviderManager
 */
export class ProviderManagerBuilder {
    private static providerManagerInstance: ProviderManager | null = null;
    protected static hasBeenInstantiated = false;

    /**
     * Sets the map to be used in the ProviderManager.
     * @param map
     */
    setMap(map: L.Map): this {
        if (ProviderManagerBuilder.providerManagerInstance !== null) {
            return this;
        }

        ProviderManagerBuilder.providerManagerInstance = new ProviderManager(map);
        ProviderManagerBuilder.hasBeenInstantiated = true;
        return this;
    }

    /**
     * Builds the ProviderManager
     */
    build(): ProviderManager {
        if (!ProviderManagerBuilder.hasBeenInstantiated) {
            throw new Error("Tried to build a ProviderManager without setting the map.");
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return ProviderManagerBuilder.providerManagerInstance!;
    }

    private waitForInstance() {
        return new Promise<void>((resolve) => {
            let interval = 0;
            interval = setInterval(() => {
                if (ProviderManagerBuilder.hasBeenInstantiated) {
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
        return ProviderManagerBuilder.providerManagerInstance!;
    }

    public hasInstance(): boolean {
        return ProviderManagerBuilder.hasBeenInstantiated;
    }
}
