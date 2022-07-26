import { createEffect, createSignal, onMount } from "solid-js";
import { StyleSheet, css } from "aphrodite/no-important";
import L, { LatLng } from "leaflet";

import { Company_, ProviderManager, ProviderManagerBuilder } from "../values/ProviderManager";

const styles = StyleSheet.create({
    container: {
        // @ts-ignore
        opacity: "var(--map-opacity)",
        transition: "opacity 150ms",
    },
    hiddenContainer: {
        opacity: 0,
    },
    mapContainer: {
        height: "100vh",
        minWidth: "0",
    },
});


function useLines(map: L.Map, manager: ProviderManager, providers: () => Company_[]) {
    createEffect(() => {
        const p = providers();

        manager.update(p);
    });
}

const hiddenContainerClass = css(styles.container, styles.hiddenContainer);
const normalContainerClass = css(styles.container);

export function Map(props: { providers: Array<Company_>, builder: ProviderManagerBuilder }) {
    const mapContainer = <div className={css(styles.mapContainer)}/>;
    const [containerClass, setContainerClass] = createSignal(hiddenContainerClass);

    onMount(() => setTimeout(() => {
        if (props.builder.hasInstance()) {
            console.log("Map::onMount - builder has a map instance...");
            return;
        }

        // Set the map in the Map Manager
        const map = L.map(mapContainer as HTMLElement);
        console.log("Map::onMount - setMap in manager");
        const manager = props.builder.setMap(map).build();

        // Set copyright of map
        L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1IjoiYXJhb3p1IiwiYSI6ImNsM2F0eTZoOTAwaHMzcWsyZGVvNm02ajcifQ.MUoj0PaUU-aS09VnomLXPg",
        }).addTo(map);

        // Set map to Arequipa
        const bound = L.latLngBounds([-16.496829, -71.493178], [-16.340929, -71.587129]);
        map.fitBounds(bound);
        map.setView(new LatLng(-16.398895, -71.536737));

        setTimeout(() => {
            map.setView(new LatLng(-16.398895, -71.536737));
        }, 2000);

        useLines(map, manager, () => props.providers);
        setContainerClass(normalContainerClass);
    }, 1000));

    return (
        <div className={containerClass()}>
            {mapContainer}
        </div>
    );
}
