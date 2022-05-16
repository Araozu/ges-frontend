import { onMount } from "solid-js";
import { StyleSheet, css } from "aphrodite";
import L from "leaflet";

const styles = StyleSheet.create({
    mapContainer: {
        height: "90vh",
    },
});

export function Map() {
    const container = <div className={css(styles.mapContainer)}/>;

    onMount(() => {
        const map = L.map(container as HTMLElement)
            .setView([51.505, -0.09], 13);

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
        <div>
            {container}
        </div>
    );
}
