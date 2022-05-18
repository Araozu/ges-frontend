import { Map } from "../components/Map";
import { Provider } from "../connection/connection";
import { createSignal } from "solid-js";
import { Providers } from "./Index/Providers";
import { StyleSheet, css } from "aphrodite/no-important";
import Split from "split-grid";

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
});

export function Index() {
    const [providers, setProviders] = createSignal<Provider[]>([]);

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
            const providers = obj as Provider[];
            setProviders(providers);
        });

    return (
        <div className={css(styles.container)}>
            <Providers providers={providers()}/>
            {sidebarGutter}
            <Map providers={providers()}/>
        </div>
    );
}
