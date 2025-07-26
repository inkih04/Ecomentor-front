import React, { PropsWithChildren } from "react";
import CalculateFormContext from "@/context/CalculateFormContext";
import { UseFormReturn } from "react-hook-form";


interface CalculateFormResultProviderProps {
    formResult: UseFormReturn<any>;
}

export const CalculateFormResultProvider: React.FC<CalculateFormResultProviderProps
    & PropsWithChildren> = ({ children, formResult }) => {
    
    return <CalculateFormContext.Provider value={{ formResult }}>
    {children}
    </CalculateFormContext.Provider>;
};

export default CalculateFormResultProvider;