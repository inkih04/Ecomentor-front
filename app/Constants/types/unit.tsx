import Field from "./field";

export interface IUnit extends Field {
    value: number | string | 0 | '0';
    symbol: string;
}

const Unit: IUnit = {
    value: 0,
    symbol: '',
    toString () {
        switch (this.value){
            case "0":
            case 0:
            default: {
                if (typeof this.value === "number" || typeof this.value === "string") {
                    return `${this.value} ${this.symbol}`;
                } else {
                    return '';
                }
            }
        }
    },
}


export default Unit;