import { Map } from "../components/Map";
import { Provider } from "../connection/connection";
import { createSignal} from "solid-js";
import { Providers } from "./Index/Providers";

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
            <Providers providers={providers()} />
            <Map providers={providers()}/>
        </div>
    );
}
