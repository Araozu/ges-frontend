import { css, StyleSheet } from "aphrodite";
import { For } from "solid-js";

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
});

export type Ruta = {
    codigo: string
}

export type Empresa = {
    nombre: string,
    rutas: Array<Ruta>,
}

function Ruta(props: {ruta: Ruta}) {
    return (
        <>
            <div className={css(styles.ruta, styles.rutaBar)}>
                <span className={`${css(styles.micon)} material-icons`}>
                    toggle_off
                </span>

                <div className={css(styles.rutaTexto)}>
                    {props.ruta.codigo}
                </div>

                <div className={css(styles.rutaTexto)} style={{"font-size": "0.75rem"}}>
                    <a href="#">
                        Mas información
                    </a>
                </div>
            </div>
            <hr/>
        </>
    );
}

export function Empresa(props: { empresa: Empresa }) {
    return (
        <div>
            <div className={css(styles.empresaLabel)}>
                Empresa
            </div>
            <div className={css(styles.empresaTopBar)}>
                <div style={{"text-align": "center"}}>
                    <span className={`${css(styles.micon)} material-icons`}>
                        toggle_off
                    </span>
                </div>
                <div className={css(styles.empresaNombre)}>
                    {props.empresa.nombre.toUpperCase()}
                </div>
            </div>

            <div className={css(styles.rutas)}>
                <div className={css(styles.empresaLabel)}>
                    Rutas
                </div>
                <For each={props.empresa.rutas}>
                    {(ruta) => <Ruta ruta={ruta} />}
                </For>
            </div>
        </div>
    );
}
