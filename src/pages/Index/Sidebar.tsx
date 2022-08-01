import { css, StyleSheet } from "aphrodite/no-important";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { Company_ } from "../../values/ProviderManager";
import { Empresa } from "./Sidebar/SidebarEmpresa";
import { ProviderManagerBuilder } from "../../values/ProviderManagerBuilder";
import { Destino } from "./Sidebar/Destino";

import logoUrl from "../../loO.jpg";
import { Company } from "../../values/Company";

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
        height: "1.5rem",
        fontSize: "1.25rem",
    },
    titleBicon: {
        fontSize: "1.5rem",
        cursor: "pointer",
        position: "absolute",
        left: "0.5rem",
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
        minHeight: "calc(100% - 3.7rem)",
        maxHeight: "calc(100% - 3.7rem)",
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
        cursor: "pointer",
    },
});

interface IconBarProps {
    isSidebarCollapsed: boolean,
    toggleSidebar: () => void,
    activeRoute: "rutas" | "destino",
    setActiveRoute: (s: "rutas" | "destino") => void,
}

function IconBar(props: IconBarProps) {
    const rutasStyle = () => (props.activeRoute === "rutas" ? {"background-color": "#06384B"} : {});
    const destinoStyle = () => (props.activeRoute === "destino" ? {"background-color": "#06384B"} : {});

    return (
        <div className={css(styles.bar)}>
            <img className={css(bar.logo)} src={logoUrl} alt="" onClick={props.toggleSidebar}/>
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

function LoadingComponent() {
    const s = StyleSheet.create({
        icon: {
            transform: "",
            color: "var(--main-color)",
            animationName: "spin",
            animationDuration: "2500ms",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
        },
    });

    return (
        <div style={{"text-align": "center"}}>
            <span
                className={`${css(styles.bicon, s.icon)} material-icons`}
            >
                cached
            </span>
        </div>
    );
}

type SidebarProps = {
    companies: Array<Company_>,
    builder: ProviderManagerBuilder,
    isSidebarCollapsed: boolean,
    toggleSidebarFn: () => void,
}

function SidebarElems(props: {companies: Company[]}) {
    onCleanup(() => console.log("SidebarElems cleanup"));

    return (
        <For each={props.companies} fallback={<LoadingComponent />}>
            {(company) => <Empresa empresa={company}/>}
        </For>
    );
}

export function Sidebar(props: SidebarProps) {
    const [companies, setCompanies] = createSignal<Company[]>([]);
    const [activeRoute, setActiveRoute] = createSignal<"rutas" | "destino">("rutas");

    createEffect(async() => {
        const companiesData = props.companies;
        console.log("Sidebar: companies updated", companiesData.length);
        const manager = await props.builder.getInstance();

        const companies = manager.getAll();
        setCompanies(companies);
    });

    return (
        <div className={css(styles.container)}>
            <Show when={!props.isSidebarCollapsed}>

                <div style={{position: "relative", overflow: "hidden"}}>
                    <h1 className={css(styles.title)} style={{position: "relative"}}>
                        <span
                            className={`${css(styles.bicon, styles.titleBicon)} material-icons`}
                            onClick={props.toggleSidebarFn}
                        >
                            menu
                        </span>
                        TU GUIA ONLINE
                    </h1>

                    <div className={css(styles.rutasContainer)}>
                        <Show when={activeRoute() === "rutas"}>

                            <SidebarElems companies={companies()} />
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
