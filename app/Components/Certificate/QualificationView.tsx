import React from "react"
import { ColorValue, StyleSheet, View, Text } from "react-native";

import colors from "@/app/Constants/colors";
import { getMatchingField } from "@/app/Constants/certificates/units";


interface QualificationViewProps {
    field: string;
    title: string;
    qualification: string;
    color: ColorValue;
    value: number;
}
export const QualificationView: React.FC<QualificationViewProps> = (props) => {
    let formattedValue = props.value.toPrecision(1);

    const fieldType = getMatchingField(props.field);
    if (fieldType) {
        fieldType.value = formattedValue;
        formattedValue = fieldType.toString();
            
    }

    return <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>
        <View style={styles.qualContainer}>
            <View style={[styles.rectangle, {backgroundColor: props.color}]}>
                <Text style={styles.label}>{props.qualification}</Text>
                <Text style={styles.value}>{formattedValue}</Text>
            </View>
            <View style={[styles.triangle, { borderLeftColor: props.color }]} />
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.forestGreen,
        marginLeft: 20,
        padding: 10,
    },
    qualContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    rectangle: {
        flex: 0.8,
        minHeight: 80,
        minWidth: 40,
        
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'flex-start',

        paddingLeft: 50,
    },
    label: {
        fontSize: 40,
        fontWeight: '900',
        color: 'black',
        textAlign: 'center',
        paddingTop: 10,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: 'black',
        marginLeft: 30,
        paddingTop: 28,
    },
    triangle: {
        flex: 0.2,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 80,
        borderTopWidth: 40,
        borderBottomWidth: 40,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
});

export default QualificationView;