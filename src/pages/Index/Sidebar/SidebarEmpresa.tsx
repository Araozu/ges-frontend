import { css, StyleSheet } from "aphrodite";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { Concession } from "../../../values/Concession";
import { Company } from "../../../values/Company";
import { Portal } from "solid-js/web";
import { AllBusStop, AllHorary } from "../../../values/RemoteInterfaces";

const styles = StyleSheet.create({
    empresaTopBar: {
        display: "grid",
        gridTemplateColumns: "30% 70%",
        padding: "0.5rem 0",
    },
    empresaLabel: {
        backgroundColor: "var(--border-color)",
        padding: "0.5rem",
        textAlign: "center",
    },
    empresaNombre: {
        textAlign: "center",
        margin: "0.75rem 0",
    },
    micon: {
        fontSize: "60px",
        verticalAlign: "middle",
        cursor: "pointer",
    },
    rutas: {},
    ruta: {
        marginLeft: "1rem",
    },
    rutaBar: {
        display: "grid",
        gridTemplateColumns: "25% 25% 50%",
        textAlign: "center",
    },
    rutaTexto: {
        margin: "0.75rem 0",
    },
    infoListaItem: {
        padding: "1rem 0",
    },
    infoGeneral: {
        display: "grid",
        gridTemplateColumns: "30% 70%",
        margin: "1rem 0",
    },
    bicon: {
        fontSize: "2.5rem",
        verticalAlign: "middle",
        textAlign: "center",
        color: "var(--main-color)",
    },
});

const infoStyles = StyleSheet.create({
    container: {
        backgroundColor: "var(--bg-color)",
        height: "90vh",
    },
});

export type Ruta = {
    codigo: string
}

export type Empresa = {
    nombre: string,
    rutas: Array<Ruta>,
}

const useToggle = (onActive?: () => void, onInactive?: () => void) => {
    const [active, setActive] = createSignal(false);
    const toggleStyle = () => {
        if (active()) {
            onActive?.();
            return {"color": "var(--main-color)"};
        } else {
            onInactive?.();
            return {};
        }
    };

    const toggleActive = () => {
        setActive((x) => !x);
    };

    const toggleIconName = () => (active() ? "toggle_on" : "toggle_off");

    return {
        active,
        toggleStyle,
        toggleActive,
        toggleIconName,
    };
};

function ConcessionEl(props: { concession: Concession, mostrarInfo: () => void, seleccionarConcession: (c: Concession) => void }) {
    const onActive = () => {
        props.concession.show();
    };
    const onInactive = () => {
        props.concession.hide();
    };

    const {
        toggleActive,
        toggleStyle,
        toggleIconName,
    } = useToggle(onActive, onInactive);

    // Cuando se desmonta el componente, retirar cualquier ruta del mapa
    onCleanup(onInactive);

    const onClick = () => {
        props.seleccionarConcession(props.concession);
        props.mostrarInfo();
    };

    return (
        <>
            <div className={css(styles.ruta, styles.rutaBar)}>
                <span
                    className={`${css(styles.micon)} material-icons`}
                    style={toggleStyle()}
                    onClick={toggleActive}
                >
                    {toggleIconName()}
                </span>

                <div className={css(styles.rutaTexto)}>
                    {props.concession.name}
                </div>

                <div className={css(styles.rutaTexto)} style={{"font-size": "0.75rem"}}>
                    <a onClick={onClick} href="#">
                        Mas información
                    </a>
                </div>
            </div>
            <hr/>
        </>
    );
}

function Info(props: { empresa: Company, concession: Concession, ocultarInfo: () => void }) {
    const [horarios, setHorarios] = createSignal<Array<AllHorary>>([]);
    const [busStops, setBusStops] = createSignal<Array<AllBusStop>>([]);

    onMount(async() => {
        console.log("info render :D (mount)");
        const additionalInfo = await props.concession.loadAdditionalInfo();
        setHorarios(additionalInfo.allHorary);
        setBusStops(additionalInfo.allBusStop);
    });

    return (
        <div className={css(infoStyles.container)}>
            <div className={css(styles.empresaLabel)} onClick={props.ocultarInfo}>
                <span className={`${css(styles.bicon)} material-icons`}>
                    chevron_left
                </span>
                {props.empresa.name}
            </div>
            <div style={{padding: "0 1.5rem"}}>
                <div className={css(styles.infoGeneral)}>
                    <span className={`${css(styles.bicon)} material-icons`}>
                        departure_board
                    </span>
                    <div>
                        <b>Información:</b>
                        <br/>
                        Ruta: {props.concession.name}
                        <br/>
                        Salidas: Cada 10 min
                    </div>
                </div>

                <div style={{
                    "background-color": "var(--border-color)",
                    padding: "0.5rem",
                }}>
                    <div><b>Horarios:</b></div>
                    <div>
                        <p>Lunes-Viernes:</p>
                        <p style={{"text-align": "right"}}>5:00am-10:00pm</p>
                        <p>Sabado-Domingo: </p>
                        <p style={{"text-align": "right"}}>4:00am-10:00pm</p>
                    </div>
                </div>
                <div>
                    <p><b>Paraderos:</b></p>
                    <ul>
                        <For each={busStops()} fallback={<span>Sin paraderos</span>}>
                            {(x) => <li className={css(styles.infoListaItem)}>{x.name}</li>}
                        </For>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function Empresa(props: { empresa: Company }) {
    const {
        active,
        toggleActive,
        toggleStyle,
        toggleIconName,
    } = useToggle();
    const [mostrarInfo, setMostrarInfo] = createSignal(false);
    const [activeConcession, setActiveConcession] = createSignal<Concession | null>(null);

    return (
        <div>
            <div className={css(styles.empresaLabel)}>
                Empresa
            </div>
            <div className={css(styles.empresaTopBar)}>
                <div style={{"text-align": "center"}}>
                    <span
                        className={`${css(styles.micon)} material-icons`}
                        onClick={toggleActive}
                        style={toggleStyle()}
                    >
                        {toggleIconName()}
                    </span>
                </div>
                <div className={css(styles.empresaNombre)}>
                    {props.empresa.name.toUpperCase()}
                </div>
            </div>

            <Show when={active()}>
                <div className={css(styles.rutas)}>
                    <div className={css(styles.empresaLabel)}>
                        Rutas
                    </div>
                    <For each={props.empresa.concessions}>
                        {(concession) => (
                            <ConcessionEl
                                concession={concession}
                                mostrarInfo={() => setMostrarInfo(true)}
                                seleccionarConcession={(it) => setActiveConcession(it)}
                            />
                        )}
                    </For>
                </div>
            </Show>

            <Show when={mostrarInfo()}>
                <Portal mount={document.getElementById("ruta_portal")!}>
                    <Info
                        empresa={props.empresa}
                        concession={activeConcession()!}
                        ocultarInfo={() => {
                            setMostrarInfo(false);
                            setActiveConcession(null);
                        }}
                    />
                </Portal>
            </Show>
        </div>
    );
}
