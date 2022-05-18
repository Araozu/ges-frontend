import { Provider } from "../../connection/connection";

export function ProviderTitle(props: { provider: Provider }) {
    return (
        <div>
            <h3>{props.provider.definition}</h3>
        </div>
    );
}
