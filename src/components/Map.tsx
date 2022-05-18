import { createEffect, createSignal, onMount, untrack } from "solid-js";
import { StyleSheet, css } from "aphrodite";
import L from "leaflet";
import { Point, Provider } from "../connection/connection";
import { Colors } from "../values/Colors";
import { ProviderManager } from "../values/ProviderManager";

const serverPath = "https://system-routes.herokuapp.com/route";

const styles = StyleSheet.create({
    mapContainer: {
        height: "100vh",
        minWidth: "0",
    },
});


function useLines(map: L.Map, manager: ProviderManager, providers: () => Provider[]) {
    const lines: Array<L.Polyline> = [];

    createEffect(() => {
        const p = providers();

        manager.update(p);
    });
}


export function Map(props: { providers: Provider[] }) {
    const container = <div className={css(styles.mapContainer)}/>;
    let map: L.Map | null = null;

    onMount(() => {
        map = L.map(container as HTMLElement);
        const manager = new ProviderManager(map);

        L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1IjoiYXJhb3p1IiwiYSI6ImNsM2F0eTZoOTAwaHMzcWsyZGVvNm02ajcifQ.MUoj0PaUU-aS09VnomLXPg",
        }).addTo(map);

        const bound = L.latLngBounds([-16.4452, -71.51738], [-16.44455, -71.506783]);
        map.fitBounds(bound);

        useLines(map, manager, () => props.providers);
    });

    return (
        <div>
            {container}
        </div>
    );
}
