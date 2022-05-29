export interface Point {
    id: number,
    latitude: number,
    longitude: number,
}

// A provider of public transportation
export interface ProviderObject {
    id: number,
    definition: string,
}
