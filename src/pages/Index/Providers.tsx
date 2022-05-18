import {StyleSheet, css} from "aphrodite";
import { Provider } from "../../connection/connection";
import { For } from "solid-js";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: "100vh",
        alignItems: "center",
    },
    provider: {
        border: "solid 1px var(--border-color)",
        borderRadius: "15px",
        margin: "0 0.5rem",
        padding: "0.3rem 0.5rem",
    },
});

function ProviderTitle(props: {p: Provider}) {
    return (
        <span className={css(styles.provider)}>
            {props.p.definition}
        </span>
    );
}

export function Providers(props: {providers: Array<Provider>}) {
    return (
        <div className={css(styles.container)}>
            <For each={props.providers}>
                {(p) => <ProviderTitle p={p} />}
            </For>
        </div>
    );
}
