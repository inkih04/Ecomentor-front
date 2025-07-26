import CUSTOM_FIELD_TYPE_MAP from "@/app/Constants/certificates/units";

import IField from "@/app/Constants/types/field"; 
import Binary from "@/app/Constants/types/binary";

type JSONValue = string | number | boolean | object | [] | null;

// Used to parse all the fields values in a certificate to displayable data
//
// Pre: data A Javascript object representing a JSON file with all the fields in a certificate
// Post: An Record with the same fields as data and values as parsed strings of their respective field. 
const parseCertificateData = function(data: object) : Record<string, string> {
  let output: Record<string, string> = {}
  for (const [field, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && !Array.isArray(value))
    {
      const nestedFields = parseCertificateData(value);
      output = {...output, ...nestedFields};
    } else {
      output[field] = parseData(field, value);
    }
  }

  return output;
}

const parseData = function (field: string, data: JSONValue): string {
  let output: string = "";
  switch (typeof data) {
    case "string": {                                // data is plain string and doesn't need parsing
      output = data as string;
      break;
    }                             
     
    case "number": {                               // data can be just a number or have a unit attached to it
      const parser = CUSTOM_FIELD_TYPE_MAP.get(field);
      
      if (parser === undefined) {
        output = (data as number).toString();     // have to specify type because for some reason the switch statement isn't narrowing the type
      } else {
        
        output = ({...parser, value: data } as IField).toString();
      }
      break;
    }
    case "boolean": {                            // data is boolean and is displaying YES or NO
      output =  ({...Binary, value: data } as IField).toString()
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
}

const qualMap = new Map<string, number>([
    ['A', 1],
    ['B', 2],
    ['C', 3],
    ['D', 4],
    ['E', 5],
    ['F', 6],
    ['G', 7],
]);

export const parseQualifications = (dataset: { label?: string, value: string | number }[]) => {
  dataset.forEach(data => {
    data.value = qualMap.get(data.value as unknown as string) ?? 7;
  });
}


export default parseCertificateData;