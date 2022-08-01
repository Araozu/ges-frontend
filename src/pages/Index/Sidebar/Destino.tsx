import { css, StyleSheet } from "aphrodite/no-important";
import { createEffect, createSignal, For, untrack } from "solid-js";
import { lastMapMarker } from "../../../values/State";
import { ProviderManagerBuilder } from "../../../values/ProviderManagerBuilder";
import { serverPath } from "../../../values/Constants";

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
    select: {
        width: "calc(100% - 4.3rem)",
        marginLeft: "2.5rem",
    },
});

function getConcessionSearchUrl(p1: [number, number]): string {
    const [x, y] = p1;
    return `${serverPath}/search-route?latitude=${x}&longitude=${y}&scope=100`;
}

function getConcessionSearchUrlv3(p1: [number, number], p2: [number, number], range: number): string {
    const [x1, y1] = [p1[0].toFixed(6), p1[1].toFixed(6)];
    const [x2, y2] = [p2[0].toFixed(6), p2[1].toFixed(6)];
    return `${serverPath}/concession/search?lat01=${x1}&long01=${y1}&lat02=${x2}&long02=${y2}&scope=${range}`;
}

interface ServerResponse {
    /** Nombre de la concesion */
    name: string,
}

interface ServerResponse3 {
    id: number,
    company: string,
    name: string,
    frequencyValue: number,
    frequencyUnit: string,
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


/**
 * Busca concesiones que esten cerca a 2 puntos.
 * @param p1 Primer punto
 * @param p2 Segundo punto
 * @return Una lista de los ids de las concesiones que pasan por ambos puntos
 */
function searchConcessionv2(p1: [number, number], p2: [number, number]): Promise<Array<ServerResponse>> {

    const promise1 = new Promise<Array<ServerResponse>>((resolve) => {
        fetch(getConcessionSearchUrl(p1))
            .then((x) => x.json())
            .then((res) => {
                if (res.content === "Error") {
                    resolve([{name: "C C08"}]);
                } else {
                    resolve(res);
                }
            })
            .catch((err) => {
                console.error("Destino::searchConcession - error en peticion 1.");
                console.error(err);
                resolve([{name: "C C08"}]);
            });
    });

    const promise2 = new Promise<Array<ServerResponse>>((resolve) => {
        fetch(getConcessionSearchUrl(p2))
            .then((x) => x.json())
            .then((res) => {
                if (res.content === "Error") {
                    resolve([{name: "C C08"}]);
                } else {
                    resolve(res);
                }
            })
            .catch((err) => {
                console.error("Destino::searchConcession - error en peticion 2.");
                console.error(err);
                resolve([{name: "C C08"}]);
            });
    });

    return new Promise<Array<ServerResponse>>((resolve) => {
        Promise.all([promise1, promise2])
            .then(([result1, result2]) => {
                const ids = [];
                console.log(result1, result2);

                for (const id1 of result1) {
                    for (const id2 of result2) {
                        if (id1.name === id2.name) ids.push(id2);
                    }
                }

                resolve(ids);
            });
    });
}

async function searchConcessionv3(p1: [number, number], p2: [number, number], range: number): Promise<Array<ServerResponse3>> {
    const request = await fetch(getConcessionSearchUrlv3(p1, p2, range));
    return await request.json();
}

export function Destino() {
    const [posOrigen, setPosOrigen] = createSignal<[number, number]>();
    const [posDestino, setPosDestino] = createSignal<[number, number]>();

    const [origenListen, setOrigenListen] = createSignal(false);
    const [destinoListen, setDestinoListen] = createSignal(false);

    const [responseDataArr, setResponseDataArr] = createSignal<Array<ServerResponse3>>([]);

    const textoOrigen = () => {
        const d = posOrigen();
        if (d !== undefined) {
            const lat = d[0].toFixed(6);
            const long = d[1].toFixed(6);
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
                new ProviderManagerBuilder().getInstance()
                    .then((instance) => {
                        instance.setOriginPinpoint(marker!);
                    });

                setOrigenListen(false);
            }
            if (destinoListen()) {
                setPosDestino(marker);
                new ProviderManagerBuilder().getInstance()
                    .then((instance) => {
                        instance.setTargetPinPoint(marker!);
                    });

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

        const concessionata = await searchConcessionv3(posOrigen()!, posDestino()!, 500);

        console.log("Destino::buscarFn - ids encontrados");
        console.log(concessionata);

        setResponseDataArr(concessionata);
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
                <select className={css(styles.select)} name="rango" id="rango">
                    <option value="10">10m</option>
                    <option value="100">100m</option>
                    <option value="500" selected>500m</option>
                </select>
                <br/>
                <br/>

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
                <For each={responseDataArr()}>
                    {(empresa: ServerResponse3) => (
                        <div>
                            jaaaaaaaaaaaaaaaaaaaaaaaaaaa
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}
