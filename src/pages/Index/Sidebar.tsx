import { StyleSheet, css } from "aphrodite";
import { createSignal, For, JSX, Show, createMemo, createEffect } from "solid-js";
import { FilledTonalButton } from "../../components/Buttons";
import { Company, Company_, ProviderManager, ProviderManagerBuilder } from "../../values/ProviderManager";
import { Empresa } from "./SidebarEmpresa";

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
    },
});

const bar = StyleSheet.create({
    button: {
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
    },
});

function Bar(props: { isSidebarCollapsed: boolean, toggleSidebar: () => void }) {
    const toggleIconName = () => (props.isSidebarCollapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left");

    const buttonClickFn = () => {
        props.toggleSidebar();
    };

    return (
        <div className={css(styles.bar)}>
            <span className={`${css(styles.bicon)} material-icons`}>
                account_circle
            </span>
            <br/>
            <br/>
            <div style={{"background-color": "#06384B"}}>
                <button className={css(bar.button)}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        moving
                    </span>
                    <br/>
                    <span className={css(styles.blabel)}>RUTAS</span>
                </button>
            </div>
            <div>
                <button className={css(bar.button)}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        airline_stops
                    </span>
                    <br/>
                    <span className={css(styles.blabel)}>DESTINO</span>
                </button>
            </div>
            <div>
                <button className={css(bar.button)}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        location_searching
                    </span>
                    <br/>
                    <span className={css(styles.blabel)}>LUGARES</span>
                </button>
            </div>

            <div className={css(styles.bottom1)}>
                <button className={css(bar.button)} onClick={buttonClickFn}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        {toggleIconName()}
                    </span>
                </button>
            </div>
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

    createEffect(async() => {
        const companiesData = props.companies;
        const manager = await props.builder.getInstance();
        setCompanies(manager.getAll());
    });

    (async() => {
        const providerManager = await props.builder.getInstance();

        const providers = (
            <For each={companies()}>
                {(company) => <Empresa empresa={company} manager={providerManager}/>}
            </For>
        );

        setProvidersElem(providers);
    })();

    return (
        <div className={css(styles.container)}>
            <Show when={!props.isSidebarCollapsed}>
                <div style={{position: "relative"}}>
                    <h1 className={css(styles.title)}>ÉL GUIA</h1>

                    {providersElem()}

                    <div className={css(styles.bottom1)}></div>
                </div>
            </Show>
            <Bar isSidebarCollapsed={props.isSidebarCollapsed} toggleSidebar={props.toggleSidebarFn}/>
        </div>
    );
}
