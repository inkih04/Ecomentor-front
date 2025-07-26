import { createContext } from "react";
import { UseFormReturn } from "react-hook-form";

export interface CalculateFormContextResult {
    formResult: UseFormReturn<any>;
}

export const CalculateFormContext = createContext<CalculateFormContextResult | undefined>(undefined);

export default CalculateFormContext;
