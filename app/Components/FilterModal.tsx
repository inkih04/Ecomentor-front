import {StyleSheet, Text, TouchableOpacity, View, Switch} from "react-native";
import React from "react";
import {FilterValue} from "@/app/Constants/types";
import {etiqs, buildingUses, climateZones} from "@/app/Constants/pickerOptions";
import FilterPicker from "@/app/Components/CustomPicker";
import colors from "@/app/Constants/colors";

interface FilterModalProps {
    closeModal: () => void;
    viewMode: string;
    setViewMode: (mode: string) => void;
    currentFilter: FilterValue;
    setCurrentFilter: (filter: FilterValue) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({closeModal, viewMode, setViewMode, currentFilter, setCurrentFilter}) => {
    const [activeFilter, setActiveFilter] = React.useState<FilterValue>(
        Object.keys(currentFilter).length > 0
            ? currentFilter
            : { }   //if there is a filter picked which isn't all, go with it, if not, go default
    );

    const toggleViewMode = () => {
        const newMode = viewMode === 'heatmap' ? 'markers' : 'heatmap';
        setViewMode(newMode);
    };

    const handleFilterChange = (filterType: string, value: string) => {
        if (value !== "All") {
            setActiveFilter(filters => {
                filters[filterType] = value;
                return {...filters };
            });
        } else {
            setActiveFilter(filters => {
                delete filters[filterType];
                return {...filters };
            });
        }
    }

    const handleOnFilter = () => {
        const filterToApply = activeFilter; //send All if no filter is set
        setCurrentFilter(filterToApply);
        closeModal();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filter certificates</Text>
            <View style={styles.filterList}>
                <View style={styles.row}>
                    <Text style ={styles.filterText}
                        >Heatmap View</Text>
                    <Switch
                        value={viewMode === "heatmap"}
                        onValueChange={toggleViewMode}
                    />
                </View>
                <View>
                    <FilterPicker
                        label="Select CO2 qualification"
                        data={etiqs}
                        selectedValue={
                            activeFilter.co2Qualification ? activeFilter.co2Qualification : "All"
                        }
                        filterName="co2Qualification"
                        onValueChange={handleFilterChange}
                    />

                    <FilterPicker
                        label="Select building use"
                        data={buildingUses}
                        selectedValue={
                            activeFilter.buildingUse ? activeFilter.buildingUse : "All"
                        }
                        filterName="buildingUse"
                        onValueChange={handleFilterChange}
                    />

                    <FilterPicker
                        label="Select climate zone"
                        data={climateZones}
                        selectedValue={
                            activeFilter.climateZone ? activeFilter.climateZone : "All"
                        }
                        filterName="climateZone"
                        onValueChange={handleFilterChange}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.filterButton} onPress={handleOnFilter}>
                    <Text style={styles.closeButtonText}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.discardButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Discard</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 2,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        top: '10%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    filterList: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginBottom: 30,
    },

    row:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
    },

    filterText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.darkGreen,
        marginBottom: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    closeButtonText: {
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterButton: {
        flex: 1,
        backgroundColor: colors.forestGreen,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 5,  //space between buttons
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    discardButton: {
        flex: 1,
        backgroundColor: '#333', //black
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
});

export default FilterModal;