

interface ConcessionView {
    startDay: string,
    endDay: string,
    startTime: number,
    endTime: number,
}


export interface AllBusStop {
    name: string,
    latitude: number,
    longitude: number,
}

export type AllHorary = any

// /concession/view?id=____
export interface ConcessionInfo {
    id: number,
    name: string,
    company: string,
    allHorary: Array<AllHorary>,
    allBusStop: Array<AllBusStop>,
}
