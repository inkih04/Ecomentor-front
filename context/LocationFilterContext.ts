import { createContext } from "react";
import * as Historic from "@/app/Constants/historic"

export type LocationFilterContextType = Record<Historic.HistoricFilterType, string[] | undefined> 

export const LocationFilterContext = createContext<LocationFilterContextType>({
    town: undefined,
    region: undefined,
    province: undefined,
});

export default LocationFilterContext;