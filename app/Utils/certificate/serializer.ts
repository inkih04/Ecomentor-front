import CUSTOM_FIELD_TYPE_MAP from "@/app/Constants/certificates/units";

import IField from "@/app/Constants/types/field";
import Binary from "@/app/Constants/types/binary";
import { number } from "yup";

type JSONValue = string | number | boolean | object | [] | null;
type ParsingTypes = "number" | "boolean";

// Used to deserialize a certificate response to a record of fields with formatted data.
//
// Pre: data A Javascript object representing a JSON file with all the fields in a certificate
//      and, optionally, the data type to format. By default, every type is formatted
//
// Post: An Record with the same fields as data and values as parsed strings of their respective field.
//      Any nested object will be flatten to the same Record
const deserializeFormattedCertificate = function (data: object, parsing?: ParsingTypes[]): Record<string, string> {
    let output: Record<string, string> = {};
    for (const [field, value] of Object.entries(data)) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const nestedFields = deserializeFormattedCertificate(value);
            output = { ...output, ...nestedFields };
        } else {
            output[field] = deserialize(field, value);
        }
    }

    return output;
};

const deserialize = function (field: string, data: JSONValue, parsing?: ParsingTypes[]): string {
    let output: string = "";
    switch (typeof data) {
        case "string": {
            // data is plain string and doesn't need parsing
            output = data as string;
            break;
        }

        case "number": {
            if (parsing !== undefined && !parsing.includes('number'))
                return (data as number).toString();

            // data can be just a number or have a unit attached to it
            const parser = CUSTOM_FIELD_TYPE_MAP.get(field);

            if (parser === undefined) {
                output = (data as number).toString(); // have to specify type because for some reason the switch statement isn't narrowing the type
            } else {
                output = ({ ...parser, value: data } as IField).toString();
            }
            break;
        }
        case "boolean": {
            if (parsing !== undefined && !parsing.includes('boolean'))
                return (data as boolean).toString();

            // data is boolean and is displaying YES or NO
            output = ({ ...Binary, value: data } as IField).toString();
            break;
        }

        default:
        case "bigint":
        case "symbol":
        case "undefined":
        case "function":
        case "object":
        case null:
            // console.error(`Error: value of JSON data cannot be this type (${typeof data})`); // eslint error????
            break;
    }

    return output;
};

export default deserializeFormattedCertificate;
