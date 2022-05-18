import {StyleSheet, css} from "aphrodite";
import { Provider } from "../../connection/connection";
import { For } from "solid-js";

const styles = StyleSheet.create({
    container: {
        height: "100vh",
    },
    title: {
        fontWeight: 600,
        textAlign: "center",
        margin: "0",
        padding: "1.5rem 0",
        borderBottom: "solid 1px var(--border-color)",
    },
    provider: {
        border: "solid 1px var(--border-color)",
        borderRadius: "15px",
        margin: "0.5rem",
        padding: "0.3rem 0.5rem",
        cursor: "pointer",
        backgroundColor: "var(--bg-color)",
        color: "var(--color)",
    },
});

function ProviderTitle(props: {p: Provider}) {
    return (
        <div>
            <button className={css(styles.provider)}>
                {props.p.definition}
            </button>
        </div>
    );
}

export function Sidebar(props: {providers: Array<Provider>}) {
    return (
        <div className={css(styles.container)}>
            <h1 className={css(styles.title)}>Proyecto GES</h1>
            <div>
                <For each={props.providers}>
                    {(p) => <ProviderTitle p={p} />}
                </For>
            </div>
        </div>
    );
}
