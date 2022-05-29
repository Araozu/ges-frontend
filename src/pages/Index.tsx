import { Map } from "../components/Map";
import { ProviderObject } from "../connection/connection";
import { createSignal } from "solid-js";
import { Sidebar } from "./Index/Sidebar";
import { StyleSheet, css } from "aphrodite/no-important";
import Split from "split-grid";
import { ProviderManager, ProviderManagerBuilder } from "../values/ProviderManager";

const path = "https://system-routes.herokuapp.com/route";

const styles = StyleSheet.create({
    container: {
        display: "grid",
        gridTemplateColumns: "1.5fr 5px 3fr",
    },
    gutter: {
        gridRow: "1/-1",
        cursor: "col-resize",
        gridColumn: "2",
        backgroundColor: "var(--color)",
    },
    mapContainer: {
        height: "100vh",
        minWidth: "0",
    },
});

export function Index() {
    const [providers, setProviders] = createSignal<ProviderObject[]>([]);
    const providerManagerBuilder = new ProviderManagerBuilder();

    const sidebarGutter = <div className={css(styles.gutter)}/>;

    Split({
        dragInterval: 10,
        columnGutters: [
            {
                element: sidebarGutter as unknown as HTMLElement,
                track: 1,
            },
        ],
        minSize: 500,
    });

    fetch(`${path}/`)
        .then((res) => res.json())
        .then((obj) => {
            const providers = obj as ProviderObject[];
            setProviders(providers);
        });

    return (
        <div className={css(styles.container)}>
            <Sidebar providers={providers()} builder={providerManagerBuilder}/>
            {sidebarGutter}
            <Map providers={providers()} builder={providerManagerBuilder}/>
        </div>
    );
}
