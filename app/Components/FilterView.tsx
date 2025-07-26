import React, { Fragment, memo, useMemo, useState } from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

import FilterPicker from "./CustomPicker";
import RadioButtonView from "./Form/RadioButtonView";

export interface FilterOptionProps {
    title: string;                              // Name of the filter
    onPress: (selected: boolean) => void;       // Callback when the filter is pressed to select or deselect it
    onOptionSelected?: (option: string) => void;// Optional, callback when a value to match the filter is selected
    options?: string[];                         // Optional, the set of value to match in a given filter
}

export interface FilterTypeProps {
    title: string;                              // Name of the filter type
    key: string;                                // Identifier of the filter type
    filters: FilterOptionProps[];               // The list of filters
    required?: boolean;                         // Optional, indicates whether a filter must be selected
}

export interface FilterViewProps {
    filterTypes: FilterTypeProps[];             // The list of filters types
    children?: React.ReactNode;                 // The ReactComponent to be display inside the view
    style?: FilterViewStyleProps;
}

export interface FilterViewStyleProps {
    title?: TextStyle;
    container?: ViewStyle;
    buttonContainer?: ViewStyle;
    buttonText?: TextStyle;
}

interface FilterMapProps {
    filterSelected: string | null;
    optionsList: string[] | null;

    filtersMap: Map<string, FilterOptionProps>;
}

type FiltersMap = Map<string,FilterMapProps>;

/**
 * FilterView component is a custom view that encapsulates a set of filters to apply with their corresponding values to match.
 * 
 * This view will display the filters on top of its children and the values to match at the bottom.
 * 
 */
export const FilterView: React.FC<FilterViewProps> = (props) => {
    const filterTypeMaps: FiltersMap = useMemo(() => new Map<string, FilterMapProps>(
        props.filterTypes.map((type) => {
            const props: FilterMapProps = {
                filterSelected: null,
                optionsList: null,
                filtersMap: new Map<string, FilterOptionProps>(type.filters.map((optionProps) => [optionProps.title, optionProps])),
            };

            return [type.key, props];
        })
    ), [props.filterTypes]);

    const [key, setKey] = useState(0);
    
    const handleSetFilterOption = (filterTypeKey: string, filter: string | null) => {
        const filterType = filterTypeMaps.get(filterTypeKey) as FilterMapProps;
        filterType.filterSelected = filter;
        
        if (filter) {
            filterType.optionsList = filterType.filtersMap.get(filter)?.options ?? [];
        } else {
            filterType.optionsList = [];
        }

        setKey(prev => prev + 1);
    }

    return (
        <>
        { props.filterTypes.map((filterType) => {
            return (<RadioButtonView
                key={`${filterType.key}_radio`}
                label={filterType.title}
                buttons={filterType.filters.map((button) => ({
                    key: button.title,
                    label: button.title,
                }))}
                style={{
                    label: StyleSheet.flatten([styles.title, props.style?.title]),
                    container: props.style?.container,
                    buttonContainer: props.style?.buttonContainer,
                    buttonText: props.style?.buttonText,
                }} 
                onPress={(key, prevkey) => {
                    const currentKey = (key ?? prevkey) ?? "";
                    filterTypeMaps.get(filterType.key)?.filtersMap.get(currentKey)?.onPress(key !== null);
                    handleSetFilterOption(filterType.key, key);
                }} 
                required={filterType.required}
                onMount={(key) => { if (filterType.required) {
                        filterTypeMaps.get(filterType.key)?.filtersMap.get(key ?? "")?.onPress(true);
                        handleSetFilterOption(filterType.key, key);
                    }
                }}/>)
        })}
        {props.children}
        { props.filterTypes.map((filterType) => {
            const filterMapProps = (filterTypeMaps.get(filterType.key) as FilterMapProps);
            return (filterMapProps.optionsList?.length ? <FilterPicker
                key={`${filterType.key}_filter`}
                label={filterType.title}
                data={filterMapProps.optionsList?.map((option) => ({
                    name: option,
                    value: option,
                })) ?? []}
                selectedValue={""}
                filterName={""}
                onValueChange={(filterName, value) => {
                    const optionProps = filterMapProps.filtersMap.get(filterMapProps.filterSelected ?? "");
                    if (optionProps && optionProps.onOptionSelected) {
                        optionProps.onOptionSelected(value);
                    }
                       
                }}
            /> : <Fragment key={`${filterType.key}_filter`}></Fragment>);
        })}
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: "500",
        color: "black",
        marginBottom: 10,
    },
});

export default FilterView;