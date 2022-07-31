import { css, StyleSheet } from "aphrodite/no-important";
import { createEffect, createSignal, For, JSX, Show } from "solid-js";
import { Company_ } from "../../values/ProviderManager";
import { Empresa } from "./Sidebar/SidebarEmpresa";
import { ProviderManagerBuilder } from "../../values/ProviderManagerBuilder";
import { Company } from "../../values/Company";
import { Destino } from "./Sidebar/Destino";

import logoUrl from "../../loO.jpg";

const styles = StyleSheet.create({
    container: {
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "auto 3rem",
    },
    bar: {
        width: "100%",
        height: "100vh",
        backgroundColor: "#FFA726",
        textAlign: "center",
        position: "relative",
    },
    title: {
        fontWeight: 600,
        textAlign: "center",
        margin: "0",
        padding: "0.8rem 0",
        borderBottom: "solid 1px var(--border-color)",
        backgroundColor: "#06384B",
        color: "white",
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
    t2: {
        display: "grid",
        gridTemplateColumns: "40% 20% 40%",
        backgroundColor: "var(--border-color)",
        padding: "0.5rem",
        textAlign: "center",
    },
    item: {
        display: "grid",
        gridTemplateColumns: "50% 50%",
        padding: "0.5rem 0",
    },
    micon: {
        fontSize: "60px",
        verticalAlign: "middle",
        marginRight: "2rem",
    },
    bicon: {
        fontSize: "2.5rem",
        verticalAlign: "middle",
        color: "white",
    },
    blabel: {
        color: "white",
        fontSize: "0.5rem",
        fontWeight: 600,
    },
    bottom1: {
        width: "100%",
        height: "2.5rem",
        backgroundColor: "#F57C00",
        position: "absolute",
        bottom: "0",
        zIndex: 10,
    },
    rutaPortal: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 5,
    },
    rutasContainer: {
        position: "relative",
        maxHeight: "85vh",
        overflowY: "scroll",
    },
});

const bar = StyleSheet.create({
    button: {
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
    },
    logo: {
        marginTop: "0.5rem",
        width: "2.6rem",
        height: "2.6rem",
        borderRadius: "1.3rem",
    },
});

interface IconBarProps {
    isSidebarCollapsed: boolean,
    toggleSidebar: () => void,
    activeRoute: "rutas" | "destino",
    setActiveRoute: (s: "rutas" | "destino") => void,
}

function IconBar(props: IconBarProps) {
    const toggleIconName = () => (props.isSidebarCollapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left");

    const buttonClickFn = () => {
        props.toggleSidebar();
    };

    const rutasStyle = () => (props.activeRoute === "rutas" ? {"background-color": "#06384B"} : {});
    const destinoStyle = () => (props.activeRoute === "destino" ? {"background-color": "#06384B"} : {});

    return (
        <div className={css(styles.bar)}>
            <img className={css(bar.logo)} src={logoUrl} alt=""/>
            <br/>
            <br/>
            <div style={rutasStyle()}>
                <button className={css(bar.button)} onClick={() => props.setActiveRoute("rutas")}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        moving
                    </span>
                    <br/>
                    <span className={css(styles.blabel)}>RUTAS</span>
                </button>
            </div>
            <div style={destinoStyle()}>
                <button className={css(bar.button)} onClick={() => props.setActiveRoute("destino")}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        airline_stops
                    </span>
                    <br/>
                    <span className={css(styles.blabel)}>DESTINO</span>
                </button>
            </div>
            {/*
            <div>
                <button className={css(bar.button)}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        location_searching
                    </span>
                    <br/>
                    <span className={css(styles.blabel)}>LUGARES</span>
                </button>
            </div>
            */}

        </div>
    );
}

type SidebarProps = {
    companies: Array<Company_>,
    builder: ProviderManagerBuilder,
    isSidebarCollapsed: boolean,
    toggleSidebarFn: () => void,
}

export function Sidebar(props: SidebarProps) {
    const [providersElem, setProvidersElem] = createSignal<JSX.Element>(<></>);
    const [companies, setCompanies] = createSignal<Array<Company>>([]);
    const [activeRoute, setActiveRoute] = createSignal<"rutas" | "destino">("rutas");

    createEffect(async() => {
        const companiesData = props.companies;
        const manager = await props.builder.getInstance();
        setCompanies(manager.getAll());
    });

    (async() => {
        const providerManager = await props.builder.getInstance();

        const providers = (
            <For each={companies()}>
                {(company) => <Empresa empresa={company}/>}
            </For>
        );

        setProvidersElem(providers);
    })();

    return (
        <div className={css(styles.container)}>
            <Show when={!props.isSidebarCollapsed}>

                <div style={{position: "relative"}}>
                    <h1 className={css(styles.title)} style={{position: "relative"}}>
                        <span
                            className={`${css(styles.bicon)} material-icons`}
                            style={{position: "absolute", left: 0, "font-size": "1rem !important"}}
                        >
                            menu
                        </span>
                        EL GUIA
                    </h1>

                    <div className={css(styles.rutasContainer)}>
                        <Show when={activeRoute() === "rutas"}>

                            {providersElem()}
                            <div id="ruta_portal" className={css(styles.rutaPortal)}></div>

                        </Show>
                        <Show when={activeRoute() === "destino"}>
                            <Destino/>
                        </Show>
                    </div>

                </div>

            </Show>
            <IconBar
                isSidebarCollapsed={props.isSidebarCollapsed}
                toggleSidebar={props.toggleSidebarFn}
                activeRoute={activeRoute()}
                setActiveRoute={(it) => setActiveRoute(it)}
            />
        </div>
    );
}
