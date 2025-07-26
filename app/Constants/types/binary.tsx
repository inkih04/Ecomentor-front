import Field from "./field";

export interface IBinary extends Field {
    value: boolean;
}

const Binary: IBinary = {
    value: true,
    toString() {
        if (typeof this.value !== "boolean")
            return '';
        return this.value ? "Yes" : "No";
    },
}

export default Binary;