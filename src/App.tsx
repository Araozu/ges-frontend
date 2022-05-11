import type { Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import L from "leaflet";
import { onMount } from "solid-js";

const App: Component = () => {
    const el1 = <div style={{height: "800px"}} />;
    let map: L.Map | null = null;
    onMount(() => {
        map = L.map(el1 as HTMLElement).setView([51.505, -0.09], 13);

        L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        }).addTo(map);
    });
    return (
        <div class={styles.App}>
            <header class={styles.header}>
                <img src={logo} class={styles.logo} alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    class={styles.link}
                    href="https://github.com/solidjs/solid"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Solid :D
                </a>
            </header>
            {el1}
        </div>
    );
};

export default App;
