import { Map } from "../components/Map";
import { createSignal } from "solid-js";
import { Sidebar } from "./Index/Sidebar";
import { StyleSheet, css } from "aphrodite/no-important";
import { Company_} from "../values/ProviderManager";
import { ProviderManagerBuilder } from "../values/ProviderManagerBuilder";

const serverPath = "https://system-routes.herokuapp.com";

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

const providerManagerBuilder = new ProviderManagerBuilder();
export function Index() {
    const [providers, setProviders] = createSignal<Company_[]>([]);


    const [isSidebarCollapsed, setIsSidebarCollapsed] = createSignal(false);
    const sidebarColumnSize = () => (isSidebarCollapsed() ? "3rem" : "24rem");

    const toggleSidebar = () => {
        setIsSidebarCollapsed((x) => !x);
    };

    fetch(`${serverPath}/company/`)
        .then((res) => res.json())
        .then(async(obj) => {
            // Edge case
            if (obj.content === "Error") return;

            console.log("Data:",obj);
            const providers = obj as Company_[];

            setProviders(providers);
        })
        .catch((err) => {
            console.log("Error fetching.", err);
        });

    return (
        <div className={css(styles.container)} style={{"grid-template-columns": `${sidebarColumnSize()} auto`}}>
            <Sidebar
                companies={providers()}
                builder={providerManagerBuilder}
                isSidebarCollapsed={isSidebarCollapsed()}
                toggleSidebarFn={toggleSidebar}
            />

            <Map providers={providers()} builder={providerManagerBuilder}/>

        </div>
    );
}
