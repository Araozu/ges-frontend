

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


// /concession/view?id=____
export interface ConcessionInfo {
    id: number,
    name: string,
    company: string,
    allHorary: Array<unknown>,
    allBusStop: Array<AllBusStop>,
}
