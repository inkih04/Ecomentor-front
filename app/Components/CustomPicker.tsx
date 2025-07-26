import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "@/app/Constants/colors";

interface PickerProps {
    label: string;
    data: Array<{ name: string; value: string }>;
    selectedValue: string;
    filterName: string;
    activeFilter?: string;
    onValueChange: (filterType: string, value: string) => void;
}

const FilterPicker: React.FC<PickerProps> = ({ label, data, selectedValue, filterName, activeFilter, onValueChange }) => {
    const enabled = !activeFilter || activeFilter === filterName;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, !enabled && styles.disabledLabel]}>{label}</Text>
            <View style={[styles.pickerWrapper, !enabled && styles.disabledPicker]}>
                <Picker
                    testID="filter-picker"
                    selectedValue={selectedValue}
                    style={styles.picker}
                    enabled={enabled}
                    onValueChange={(value) => onValueChange(filterName, value)}
                >
                    <Picker.Item label="All" value="All" />
                    {data.map((item) => (
                        <Picker.Item key={item.value} label={item.name} value={item.value} />
                    ))}
                </Picker>
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
    disabledLabel: {
        color: "#aaa",
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        overflow: "hidden",
    },
    disabledPicker: {
        borderColor: "#ddd",
        backgroundColor: "#f0f0f0",
    },
    picker: {
        height: 50,
        backgroundColor: colors.forestGreen,
    },
});

export default FilterPicker;
