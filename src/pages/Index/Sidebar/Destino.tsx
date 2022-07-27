import { css, StyleSheet } from "aphrodite/no-important";
import { createEffect, createSignal, For, untrack } from "solid-js";
import { lastMapMarker } from "../../../values/State";
import { ProviderManagerBuilder } from "../../../values/ProviderManagerBuilder";
import { serverPath } from "../../../values/Constants";
import { Empresa } from "./SidebarEmpresa";
import { Company } from "../../../values/Company";

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
    empresasLabel: {
        backgroundColor: "var(--border-color)",
        padding: "0.5rem 1rem",
        marginTop: "0.2rem",
    },
    botonBuscar: {
        borderRadius: "10px",
        border: "solid 2px var(--main-color)",
        backgroundColor: "var(--bg-color)",
        padding: "0.25rem 0.5rem",
        cursor: "pointer",
    },
});

function getConcessionSearchUrl(p1: [number, number]): string {
    const [x, y] = p1;
    return `${serverPath}/search-route?latitude=${x}&longitude=${y}&scope=500`;
}

type ConcessionID = number;

/**
 * Busca concesiones que esten cerca a 2 puntos.
 * @param p1 Primer punto
 * @param p2 Segundo punto
 * @return Una lista de los ids de las concesiones que pasan por ambos puntos
 */
function searchConcession(p1: [number, number], p2: [number, number]): Promise<Array<ConcessionID>> {

    const promise1 = new Promise<Array<number>>((resolve) => {
        fetch(getConcessionSearchUrl(p1))
            .then((x) => x.json())
            .then((res) => {
                if (res.content === "Error") {
                    resolve([6010000000003]);
                } else {
                    resolve(res);
                }
            })
            .catch((err) => {
                console.error("Destino::searchConcession - error en peticion 1.");
                console.error(err);
                resolve([6010000000003]);
            });
    });

    const promise2 = new Promise<Array<ConcessionID>>((resolve) => {
        fetch(getConcessionSearchUrl(p2))
            .then((x) => x.json())
            .then((res) => {
                if (res.content === "Error") {
                    resolve([6010000000003]);
                } else {
                    resolve(res);
                }
            })
            .catch((err) => {
                console.error("Destino::searchConcession - error en peticion 2.");
                console.error(err);
                resolve([6010000000003]);
            });
    });

    return new Promise<Array<ConcessionID>>((resolve) => {
        Promise.all([promise1, promise2])
            .then(([result1, result2]) => {
                const ids = [];
                console.log(result1, result2);

                for (const id1 of result1) {
                    for (const id2 of result2) {
                        if (id1 === id2) ids.push(id2);
                    }
                }

                resolve(ids);
            });
    });
}

export function Destino() {
    const [posOrigen, setPosOrigen] = createSignal<[number, number]>();
    const [posDestino, setPosDestino] = createSignal<[number, number]>();

    const [origenListen, setOrigenListen] = createSignal(false);
    const [destinoListen, setDestinoListen] = createSignal(false);

    const [empresas, setEmpresas] = createSignal<Array<Company>>([]);

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

    const buscarFn = async() => {
        const origen = posOrigen();
        const destino = posDestino();

        if (origen === undefined || destino === undefined) return;

        const concessionPromise = searchConcession(posOrigen()!, posDestino()!);
        const managerPromise = new ProviderManagerBuilder().getInstance();

        const [ids, manager] = await Promise.all([concessionPromise, managerPromise]);

        console.log("Destino::buscarFn - ids encontrados");
        console.log(ids);

        const newCompanies = [];
        for (const id of ids) {
            const company = manager.getCompanyByConcessionId(id);
            if (company !== null) {
                newCompanies.push(company);
            }
        }

        setEmpresas(newCompanies);
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

                <div style={{"text-align": "center"}}>
                    <button className={css(styles.botonBuscar)} onClick={buscarFn}>
                        Buscar
                    </button>
                </div>
            </div>

            <div>
                {/*
                <div className={css(styles.empresasLabel)}>Empresas</div>
                */}
                <For each={empresas()}>
                    {(empresa) => <Empresa empresa={empresa} />}
                </For>
            </div>
        </div>
    );
}
