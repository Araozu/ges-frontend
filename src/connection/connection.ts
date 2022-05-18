export interface Point {
    id: number,
    latitude: number,
    longitude: number,
}

// A provider of public transportation
export interface Provider {
    id: number,
    definition: string,
}
