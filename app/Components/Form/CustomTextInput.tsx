import React, { ReactNode, useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { InputModeOptions } from 'react-native';

import { colors } from '@/app/Constants/colors';
import { OneOf } from '@/app/Utils/type';


export interface ValueChangeReturn {
    value: string | null;                   // Value return on new value in input. If its invalid, its null
    onChangeValue?: string;                 // Optional, new value to output to onChangeValue callback instead of value
}

type CustomValueValidators = OneOf<{
    pattern?: RegExp;                       // Optional, pattern that the input has to match to be valid
    handleValueChange?: (value: string,      // Optional, overrides the default new value handling.
        previous: string) => ValueChangeReturn;
}>;

export type CustomTextInputProps = {
    label: string;                          // Label for the input field   
    onChangeValue: (value: string) => void; // Callback function to handle value changes in the input field.                                         

    onMountValue?: string;                  // Optional, sets the value when first mounted
    inputMode?: InputModeOptions;           // Optional, sets the input mode. By default is text
        
    customItems?: ReactNode | ReactNode[];  // Optional, will be rendered next to the input;

    style?: {
        container?: ViewStyle;
        label?: TextStyle;
        textInputWrapper?: ViewStyle;
        textInput?: TextStyle;
        units?: TextStyle;
    }
} & CustomValueValidators;

/**
 * * CustomTextInput component is a custom input field that allows users to enter text. 
 */
export const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
    const [value, setValue] = useState<string>(props.onMountValue ?? "");

    // Call when first render
    useEffect(() => {
        props.onChangeValue(value);
    }, []);
    

    const handleValueChange =(value: string, previous: string) => {        
        const handleResult = props.handleValueChange ? props.handleValueChange(value, previous) :
            handlePattern(value, props.pattern);

        if (handleResult.value === null)
            return;

        const valueChange = handleResult.onChangeValue !== undefined ? handleResult.onChangeValue
            : handleResult.value;

        props.onChangeValue(valueChange);
        setValue(handleResult.value);
    }

    return (
        <View style={props.style?.container}>
            <Text style={[styles.label, props.style?.label]}>{props.label}</Text>
            <View style={[styles.textInputWrapper, props.style?.textInputWrapper]}>
                <TextInput
                    style={[styles.textInput, props.style?.textInput]}
                    value={value}
                    inputMode={props.inputMode ?? 'text'}
                    onChangeText={(text) => handleValueChange(text, value)}
                />
                { props.customItems }
            </View>
        </View>
    );
}

const handlePattern = (value: string, pattern: RegExp | undefined): ValueChangeReturn => {
    if (pattern === undefined)
        return { value };

    return { value: pattern.test(value) ? value : null };
}

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
        fontSize: 25,
    },
    disabled: {
        backgroundColor: '#e7e7e7',
        color: '#888',
    }
});

export default CustomTextInput;