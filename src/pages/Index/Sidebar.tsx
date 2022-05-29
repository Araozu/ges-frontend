import {StyleSheet, css} from "aphrodite";
import { ProviderObject } from "../../connection/connection";
import { createSignal, For, JSX, Show } from "solid-js";
import { FilledCard } from "../../components/Cards";
import { FilledTonalButton } from "../../components/Buttons";
import { ProviderManager, ProviderManagerBuilder } from "../../values/ProviderManager";

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

function ProviderTitle(props: {p: ProviderObject, manager: ProviderManager}) {
    const provider = props.manager.getById(props.p.id)!;

    return (
        <div style={{margin: "0.25rem"}}>
            <FilledTonalButton onClick={() => provider.toggleHide()}>
                {props.p.definition}
            </FilledTonalButton>
        </div>
    );
}

export function Sidebar(props: {providers: Array<ProviderObject>, builder: ProviderManagerBuilder}) {
    const [providersElem, setProvidersElem] = createSignal<JSX.Element>(<></>);

    (async() => {
        const providerManager = await props.builder.getInstance();

        const providers = (
            <For each={props.providers}>
                {(p) => <ProviderTitle p={p} manager={providerManager} />}
            </For>
        );

        setProvidersElem(providers);
    })();

    return (
        <div className={css(styles.container)}>
            <h1 className={css(styles.title)}>Rutas GES</h1>

            {providersElem()}
        </div>
    );
}
