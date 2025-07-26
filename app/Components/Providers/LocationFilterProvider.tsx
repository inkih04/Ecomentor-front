import React, { PropsWithChildren, useEffect, useState } from "react";
import LocationFilterContext from "@/context/LocationFilterContext";
import { fetchHistoricDataOptions } from "@/app/Services/certificates/service";

import { HistoricFilterType } from "@/app/Constants/historic";


export const LocationFilterProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [options, setOptions] = useState<Record<HistoricFilterType, string[] | undefined>>({
        town: undefined,
        region: undefined,
        province: undefined,
    });
    
    useEffect(() => {
        fetchHistoricDataOptions()
        .then((value) => {
            if (value === undefined) return;

            setOptions(value);
        });

    }, []);

    return <LocationFilterContext.Provider value={options}>
    {children}
    </LocationFilterContext.Provider>
}

export default LocationFilterProvider;