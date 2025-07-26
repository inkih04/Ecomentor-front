import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

import CustomButton from "../CustomButton";
import { colors } from "@/app/Constants/colors";

/**
 * RadioButtonProps interface defines the structure of a radio button item.
 * It includes a label for display and a unique key to identify the button.
 */
interface RadioButtonProps {
    label: string;
    key: string;
}


interface RadioButtonViewProps {
    label?: string;                         // - Optional, label for the radio button group
    onPress: (key: string | null,           // - Callback function to handle button press events. It receives the selected key and the previous one
        prevkey: string | null) => void;    //      If a key is or was not selected, it is null.
    buttons?: RadioButtonProps[];           // - Optional array of radio button items. If not provided, default yes/no buttons will be used.
    required?: boolean;                     // - Optional flag to indicate if the selection is required.
    onMount?: (key: string | null) => void; // - Optional callback function that is called in mount with the current selected key
                                            //      if required, the key will be the first button key or 'yes' if no buttons specified
    style?: {
        container?: ViewStyle;
        label?: TextStyle;
        buttonGroup?: ViewStyle;
        buttonContainer?: ViewStyle;
        buttonText?: TextStyle;
    };
}

/**
 * RadioButtonView component is a custom radio button group that allows users to select one option from a list of buttons.
 * It supports both a predefined set of buttons and a default yes/no option.
 * 
 */
export const RadioButtonView: React.FC<RadioButtonViewProps> = (props) => {
    const { t } = useTranslation();
    const [selectedKey, setSelectedKey] = useState<string | null>(
        props.required ? (props.buttons ? props.buttons[0].key : "no") : null
    );

    useEffect(() => {
        if (props.onMount && props.required)
            props.onMount(selectedKey)
    }, []);
    

    const handleButtonPress = (key: string) => {
        if (selectedKey === key) {
            if (props.required) return;

            props.onPress(null, selectedKey); // Deselect the button if it's already selected
            setSelectedKey(null);
        } else {
            props.onPress(key, selectedKey);
            setSelectedKey(key); 
        }
    };

    return (
        <View style={[styles.container, props.style?.container]}>
            {
                props.label !== undefined ? <Text style={[styles.label, props.style?.label]}>{props.label}</Text>
                : <></>
            }
            <View style={[styles.buttonGroup, props.style?.buttonGroup]}>
                {props.buttons ? props.buttons.map((button) => (
                    <CustomButton
                        key={button.key}
                        title={button.label}
                        onPress={() => handleButtonPress(button.key)}
                        selected={selectedKey === button.key}
                        style={{
                            buttonContainer: props.style?.buttonContainer,
                            buttonText: props.style?.buttonText,
                        }}
                        
                    />
                )) : <>
                    <CustomButton
                        title={t("yes")}
                        onPress={() => handleButtonPress("yes")}
                        selected={selectedKey === "yes"}
                        style={{
                            buttonContainer: props.style?.buttonContainer,
                            buttonText: props.style?.buttonText,
                        }} />
                    <CustomButton
                        title={t("no")}
                        onPress={() => handleButtonPress("no")}
                        selected={selectedKey === "no"}
                        style={{
                            buttonContainer: props.style?.buttonContainer,
                            buttonText: props.style?.buttonText,
                        }} />
                </>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.darkGreen,
        marginBottom: 5,
    },
    buttonGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
});

export default RadioButtonView;