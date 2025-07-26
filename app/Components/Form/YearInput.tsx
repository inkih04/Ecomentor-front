import React from "react";

import NumericalInput, { NumericalInputProps } from "./NumericalInput";
import { ValueChangeReturn } from "./CustomTextInput";

export const YearInput: React.FC<NumericalInputProps> = (props) => {
    return <NumericalInput
        handleValueChange={props.handleValueChange ?? handleYearInput}
        {...props}
        pattern={undefined}/>
}

const handleYearInput = (value: string, previous: string): ValueChangeReturn => {
    let newText = value;
    
    const year = parseInt(newText);
    const currentYear = new Date().getFullYear();
    
    if (year > currentYear)
        newText = currentYear.toString();

    return { value: newText };
};