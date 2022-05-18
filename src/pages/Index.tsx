import { Map } from "../components/Map";
import { Provider } from "../connection/connection";
import { createEffect, createSignal, For } from "solid-js";
import { ProviderTitle } from "./Index/ProviderTitle";

const path = "https://system-routes.herokuapp.com/route";

export function Index() {
    const [providers, setProviders] = createSignal<Provider[]>([]);

    fetch(`${path}/`)
        .then((res) => res.json())
        .then((obj) => {
            const providers = obj as Provider[];
            setProviders(providers);
        });

    return (
        <div>
            <For each={providers()} fallback={<div>Cargando...</div>}>
                {(provider) => <ProviderTitle provider={provider} />}
            </For>
            <Map providers={providers()}/>
        </div>
    );
}
