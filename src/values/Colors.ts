

const colors: Readonly<Array<string>> = Object.freeze([
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
]);

const colorsSize = colors.length;

export class Colors {
    static current = 0;

    static next(): string {
        if (this.current >= colorsSize) {
            this.current = 0;
        }

        const returnValue = colors[this.current];
        this.current += 1;
        return returnValue;
    }
}
