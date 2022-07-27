import { css, StyleSheet } from "aphrodite/no-important";
import { createEffect, createSignal, untrack } from "solid-js";
import { lastMapMarker } from "../../../values/State";

const styles = StyleSheet.create({
    header: {
        backgroundColor: "var(--border-color)",
        padding: "1rem 0.5rem",
    },
    icon1: {
        verticalAlign: "middle",
        fontSize: "1.5rem",
        margin: "0.5rem",
        color: "#2196F3",
    },
    icon2: {
        verticalAlign: "middle",
        fontSize: "1.5rem",
        margin: "0.5rem",
        color: "#4CAF50",
    },
    inputBar: {
        cursor: "pointer",
        borderStyle: "solid",
        borderWidth: "3px",
        borderColor: "transparent",
        borderRadius: "10px",
    },
    inputSelectedOrigen: {
        borderColor: "#2196F3",
    },
    inputSelectedDestino: {
        borderColor: "#4CAF50",
    },
});

export function Destino() {
    const [posOrigen, setPosOrigen] = createSignal<[number, number]>();
    const [posDestino, setPosDestino] = createSignal<[number, number]>();

    const [origenListen, setOrigenListen] = createSignal(false);
    const [destinoListen, setDestinoListen] = createSignal(false);

    const textoOrigen = () => {
        const d = posOrigen();
        if (d !== undefined) {
            const lat = d[0].toFixed(8);
            const long = d[1].toFixed(8);
            return `${lat} ${long}`;
        } else {
            return "";
        }
    };

    const textoDestino = () => {
        const d = posDestino();
        if (d !== undefined) {
            const lat = d[0].toFixed(8);
            const long = d[1].toFixed(8);
            return `${lat} ${long}`;
        } else {
            return "";
        }
    };

    createEffect(() => {
        const marker = lastMapMarker();
        untrack(() => {
            if (origenListen()) {
                setPosOrigen(marker);
                setOrigenListen(false);
            }
            if (destinoListen()) {
                setPosDestino(marker);
                setDestinoListen(false);
            }
        });
    });

    const origenOnClick = () => {
        setOrigenListen(true);
        console.log("Listening origen...");
    };

    const destinoOnClick = () => {
        setDestinoListen(true);
        console.log("Listening destino...");
    };

    return (
        <div>
            <div className={css(styles.header)}>
                <div
                    className={css(styles.inputBar, origenListen() && styles.inputSelectedOrigen)}
                    onClick={origenOnClick}
                >
                    <span class={`material-icons ${css(styles.icon1)}`}>
                        my_location
                    </span>
                    <input
                        type="text"
                        placeholder={"Desde"}
                        disabled
                        style={{cursor: "pointer"}}
                        value={textoOrigen()}
                    />
                </div>
                <div
                    className={css(styles.inputBar, destinoListen() && styles.inputSelectedDestino)}
                    onClick={destinoOnClick}
                >
                    <span class={`material-icons ${css(styles.icon2)}`}>
                        my_location
                    </span>
                    <input
                        type="text"
                        placeholder={"Hasta"}
                        disabled style={{cursor: "pointer"}}
                        value={textoDestino()}
                    />
                </div>
            </div>
            <div>
                <div>Empresas</div>
            </div>
        </div>
    );
}
