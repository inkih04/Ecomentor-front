import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { colors } from "@/app/Constants/colors";

export interface CustomButtonProps {
    title: string;
    onPress: () => void;
    selected?: boolean;
    toggleable?: boolean;
    enabled?: boolean;

    style?: {
        buttonContainer?: ViewStyle;
        buttonText?: TextStyle;
        selected?: ViewStyle;
        unselected?: ViewStyle;
        disabled?: ViewStyle;
    }
    
}

const CustomButton: React.FC<CustomButtonProps> = (props) => {
    const [pressed, setPressed] = useState(props.toggleable ? false : props.selected);
    const enabled = props.enabled !== undefined ? props.enabled : true;

    const handleOnPress = () => {
        if (enabled)
            props.onPress();
    };
    const handleOnPressIn = () => {
        if (props.toggleable && enabled)
            setPressed(true);
    };
    const handleOnPressOut = () => {
        if (props.toggleable && enabled)
            setPressed(false);
    }; 

    return (
        <Pressable
            onPress={handleOnPress}
            onPressIn={() => handleOnPressIn()}
            onPressOut={() => handleOnPressOut()}
            style={[
                styles.buttonContainer,
                props.style?.buttonContainer,
                (props.toggleable ? pressed : props.selected) ? [styles.selected, props.style?.selected] 
                    : [styles.unselected, props.style?.unselected],
                !enabled && props.style?.disabled,
            ]}
        >
            <Text style={[styles.buttonText, props.style?.buttonText]}>{props.title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: colors.darkGreen,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "500",
    },
    selected: {
        backgroundColor: colors.darkGreen,
    },
    unselected: {
        backgroundColor: "grey",
    }
});

export default CustomButton;