import { Map } from "../components/Map";
import { ProviderObject } from "../connection/connection";
import { createSignal } from "solid-js";
import { Sidebar } from "./Index/Sidebar";
import { StyleSheet, css } from "aphrodite/no-important";
import { ProviderManager, ProviderManagerBuilder } from "../values/ProviderManager";

const path = "https://system-routes.herokuapp.com/route";

const styles = StyleSheet.create({
    container: {
        display: "grid",
        // gridTemplateColumns: "24rem auto",
    },
    gutter: {
        gridRow: "1/-1",
        cursor: "col-resize",
        gridColumn: "2",
        backgroundColor: "#ece9e5",
    },
    mapContainer: {
        height: "100vh",
        minWidth: "0",
    },
});

export function Index() {
    const [providers, setProviders] = createSignal<ProviderObject[]>([]);
    const providerManagerBuilder = new ProviderManagerBuilder();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = createSignal(false);
    const sidebarColumnSize = () => (isSidebarCollapsed() ? "3rem" : "24rem");

    const toggleSidebar = () => {
        setIsSidebarCollapsed((x) => !x);
    };

    fetch(`${path}/`)
        .then((res) => res.json())
        .then((obj) => {
            const providers = obj as ProviderObject[];
            setProviders(providers);
        });

    return (
        <div className={css(styles.container)} style={{"grid-template-columns": `${sidebarColumnSize()} auto`}}>
            <Sidebar
                providers={providers()}
                builder={providerManagerBuilder}
                isSidebarCollapsed={isSidebarCollapsed()}
                toggleSidebarFn={toggleSidebar}
            />
            <div>
                <h1>Mapa aqui...</h1>
            </div>
            {/*
            <Map providers={providers()} builder={providerManagerBuilder}/>
            */}
        </div>
    );
}
