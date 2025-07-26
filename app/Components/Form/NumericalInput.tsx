import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { colors } from '@/app/Constants/colors';

import CustomTextInput, { CustomTextInputProps, ValueChangeReturn } from './CustomTextInput';
import { useTranslation } from 'react-i18next';


export type NumericalInputProps = {
    units?: string;                         // Optional units to display next to the input field.
} & CustomTextInputProps;

/**
 * * NumericalInput component is a custom input field that allows users to enter positive numerical values (including zero). 
 */
export const NumericalInput: React.FC<NumericalInputProps> = (props) => {
    const { t } = useTranslation();

    return (<CustomTextInput 
        onMountValue="0"
        inputMode="decimal"
        handleValueChange={handleNumberInputChange}
        customItems={props.units && (<Text style={[styles.units, props.style?.label]}>{t(props.units)}</Text>) }
        {...props}
        pattern={undefined}
    />);
}

const handleNumberInputChange = (value: string, previous: string): ValueChangeReturn  => {
    let newText = value;

    // Replace commas with dots for consistency
    newText = newText.replace(",", ".");


    // If empty, send send the value as '0'
    if (newText.length == 0) {
        return { value: newText, onChangeValue: '0' };
    }

    // If only one dot, send the value as '0.'
    if (newText.match(/^\.$/)){
        return { value: newText, onChangeValue: '0.' };
    }

    // Allow only one decimal point
    if ((newText.match(/\./g) || []).length > 1) {
        return { value: null };
    }

    // Remove invalid characters
    if (!/^\d*\.?\d*$/.test(newText)) {
        return { value: null };
    }

    return { value: newText, onChangeValue: newText }
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.darkGreen,
        marginBottom: 5,
    },
    textInputWrapper: {
        marginTop: 10,
        flexDirection: "row",
        columnGap: 10,
    },
    textInput: {
        width: 200,
        height: 55,
        paddingLeft: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        color: 'black',
        borderRadius: 8,
        zIndex: 0,

        fontSize: 25,
    },
    units: {
        alignSelf: "center",
        fontSize: 16,
    },
    disabled: {
        backgroundColor: '#e7e7e7',
        color: '#888',
    }
});

export default NumericalInput;