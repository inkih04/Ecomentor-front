import React, { useState, useMemo, useContext, useCallback } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-gifted-charts";

import InfoCard from "./InfoCard";
import FilterView, { FilterTypeProps } from "./FilterView";
import { interpolateEcoColor, generateColorPalette } from "@/app/Utils/color"; // Import your color interpolation function

import { useTranslation } from "react-i18next";

import CUSTOM_FIELD_TYPE_MAP from "@/app/Constants/certificates/units";
import Unit from "@/app/Constants/types/unit";
import useHistoricData, { Data, HistoricDataset } from "../CustomHooks/useHistoricData";
import { HistoricDatasetType } from "../Constants/historic";
import LocationFilterContext from "@/context/LocationFilterContext";
import * as Historic from "@/app/Constants/historic"
import RadioButtonView from "./Form/RadioButtonView";

type BarChartDataType = 'number' | 'qualification' | 'percentatge';

export interface CustomBarChartProps extends GroupByProps {
    title: string;                        // Title of the component
    type: HistoricDatasetType;
    icon?: React.JSX.Element;
    suffix?: string;                      // Prefix for Y-axis labels
    prefix?: string;                      // Suffix for Y-axis labels
    dataType?: BarChartDataType;
};

interface GroupByProps {
    columnLabels?: string[];               // Optional, indicates whether a dataset has to be grouped by and the labels for each column
}


export const HistoricBarChart: React.FC<CustomBarChartProps> = (props) => {
    const { t } = useTranslation();
    const DEFAULT_LABEL = t('catalonia');

    const [containerWidth, setContainerWidth] = useState(0);

    const historicDataReturn = useHistoricData({ type: props.type, defaultLabel: DEFAULT_LABEL });
    const options = useContext(LocationFilterContext);

    const dataset = historicDataReturn.current?.dataset ?? [];
    const dataType = props.dataType ?? 'number';

    const isGroupBy = dataset.filter(dataUnit => dataUnit.label === undefined).length > 0;

    const colorPalette = props.columnLabels ? generateColorPalette(props.columnLabels.length) : undefined;
    const barDataProps = getBarDataProps(dataset, isGroupBy, dataType, props.columnLabels, colorPalette);

    const groupProps = isGroupBy && props.columnLabels ? groupByChartProps : {};
    const qualProps = props.dataType == 'qualification' ? qualificationProps : {};

    const handleOnPress = useCallback((type: Historic.HistoricFilterType, selected: boolean) => {
        if (!selected) return;

        historicDataReturn.fetch({ locationType: type, label: DEFAULT_LABEL, actionType: 'replace' });

    }, []);

    const handleOnOptionSelected = useCallback((type: Historic.HistoricFilterType, option: string) => {
        if (historicDataReturn.length < historicDataReturn.maxLength)
            historicDataReturn.fetch({ locationType: type, locationOption: option, label: t(option), actionType: 'push' });
        else
            historicDataReturn.fetch({ locationType: type, locationOption: option, label: t(option), actionType: 'replace' });
    }, [historicDataReturn.length]);

    const filterOptions = useMemo(() => {
        return [
            {
                title: t("filterBy"),
                key: "filterBy",
                filters: [
                    {
                        title: t("town"), onPress: (selected) => handleOnPress('town', selected),
                        options: options.town, onOptionSelected: (option) => handleOnOptionSelected("town", option)
                    },
                    {
                        title: t("region"), onPress: (selected) => handleOnPress('region', selected),
                        options: options.region, onOptionSelected: (option) => handleOnOptionSelected("region", option)
                    },
                    {
                        title: t("province"), onPress: (selected) => handleOnPress('province', selected),
                        options: options.province, onOptionSelected: (option) => handleOnOptionSelected("province", option)
                    },
                ],
            },
        ] as FilterTypeProps[];

    }, [historicDataReturn.length, options]);


    return (
        <InfoCard
            {...props}
            style={{ ...styles }}
            isAccordionEnabled={false}
            customItems={
                <View
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setContainerWidth(width);
                    }}>
                    <FilterView
                        filterTypes={filterOptions}
                        style={{ container: { marginBottom: 10 } }}>
                        <>
                            <View style={styles.columnLabelsContainer}>
                                <>
                                    {
                                        props?.columnLabels?.map((label, index) => <ColumnLabel
                                            key={label}
                                            label={label}
                                            color={colorPalette?.at(index) ?? ""} />) ?? <></>
                                    }
                                </>
                            </View>
                            <ConditionalBarChart dataset={barDataProps.dataset}
                                label={historicDataReturn.current?.label ?? ""}
                                {...historicDataReturn}
                                containerWidth={containerWidth}
                                groupProps={groupProps}
                                qualProps={qualProps}
                                loading={historicDataReturn.isLoading} />
                        </>
                    </FilterView>
                </View>
            }
        />

    );
};

const getBarDataProps = (dataset: Data[], isGroupBy: boolean, dataType: BarChartDataType, columnLabels?: string[], colorPalette?: string[]) => {
    if (dataset.length == 0) return { maxValue: 0, dataset };

    const maxValue = Math.max(...dataset.map((dataUnit) => dataUnit.value)); // Find the maximum value in the dataset

    // Props to set if the chart is group by
    const labelWidth = (10 + ((columnLabels?.length ?? 1) - 1) * (groupByBarProps.spacing + groupByBarProps.barWidth));

    return {
        dataset: dataset.map((dataUnit, index) => {
            const groupProps: Record<string, any> = isGroupBy && columnLabels &&
                (index % columnLabels.length != columnLabels.length - 1) ? groupByBarProps : {};

            if (colorPalette && columnLabels) {
                groupProps.frontColor = colorPalette[index % columnLabels.length];
                if (isGroupBy) {
                    groupProps.labelWidth = columnLabels ? labelWidth : groupProps.labelWidth;
                }
            }

            let label = dataUnit.value.toFixed(2);
            if (dataType == 'qualification')
                label = qualificationProps.yAxisLabelTexts[dataUnit.value];
            else if (dataType == 'percentatge')
                label = `${(dataUnit.value * 100).toFixed(2)}%`

            return ({
                value: dataUnit.value,
                label,
                frontColor: interpolateEcoColor(dataUnit.value, maxValue), // Use app's primary color for bars if no color palette

                ...groupProps,
            })
        }),
    };
};

interface ConditionalBarChartProps {
    dataset: Data[];
    label: string;
    setIndex: (index: number) => void;
    maxLength: number;
    datasetList: HistoricDataset[];

    containerWidth: number;
    groupProps: object;
    qualProps: object;

    loading: boolean;
}

const ConditionalBarChart: React.FC<ConditionalBarChartProps> = ({ dataset, containerWidth,
    groupProps, qualProps, setIndex, datasetList, loading }) => {
    const [optionSelected, setOptionSelected] = useState(0);

    const maxValue = useMemo(() => {
        return Math.max(...datasetList.flatMap((set) => set.dataset.map((dataUnit) => dataUnit.value)));
    }, [dataset]);

    const barChart = dataset.length != 0 ? <BarChart
        data={dataset}
        width={containerWidth - 70 - (styles.barChartContainer.padding * 2)} // Add padding to the sides
        height={300} // Adjust height to fit bars and labels
        barWidth={30} // Width of each bar
        maxValue={maxValue} // Maximum value for the Y-axis
        noOfSections={5} // Number of horizontal grid lines
        yAxisThickness={1} // Hide Y-axis line
        xAxisThickness={1} // Hide X-axis line
        barBorderRadius={8} // Rounded corners for bars
        yAxisTextStyle={styles.yAxisText} // Style for Y-axis labels
        xAxisLabelTextStyle={styles.xAxisText} // Style for X-axis labels
        hideRules={false} // Hide grid lines
        hideYAxisText={true}
        disablePress={true}
        {...groupProps}
        {...qualProps}
    /> : <></>

    const buttons = useMemo(() => {
        return datasetList.map((dataset, index) => {
            return { label: dataset.label, key: index.toString() }
        });

    }, [datasetList.length, dataset]);

    const onButtonPress = useCallback((key: string | null, prevKey: string | null) => {
        if (prevKey === key) return;
        const index = parseInt(key ?? '0');

        setIndex(index);
        setOptionSelected(index);
    }, []);

    return (<View style={styles.barChartContainer}>
        {loading ? <ActivityIndicator size={300} /> : barChart}
        <View style={styles.barChartNavContainer}>
            {
                buttons.length > 0 ? <RadioButtonView onPress={onButtonPress}
                    buttons={buttons}
                    required
                    style={{ buttonGroup: { justifyContent: "space-between" } }} /> : <></>
            }
        </View>
    </View>);
};



const ColumnLabel: React.FC<{ label: string, color: string }> = (props) => {
    const { t } = useTranslation();

    const labelUnit = (CUSTOM_FIELD_TYPE_MAP.get(props.label) as typeof Unit)?.symbol;

    return <View style={styles.labelContainer} onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={styles.labelText}>{t(props.label)}</Text>
            {labelUnit ? <Text style={{ fontSize: 10 }}>{labelUnit}</Text> : <></>}
        </View>
        <View style={[styles.labelCircle, { backgroundColor: props.color }]} />
    </View>
}

const groupByChartProps = {
    barWidth: 10,
    spacing: 30,
}
const groupByBarProps = {
    ...groupByChartProps,
    spacing: 10,
}

const qualificationProps = {
    yAxisLabelTexts: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
    maxValue: 7,
}

const styles = StyleSheet.create({
    view: {
        margin: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleContainer: {
        margin: 0,
    },
    container: {

    },
    icon: {
        margin: 0,
    },
    barChartContainer: {
        display: 'flex',
        flexDirection: 'column',

        padding: 20,
    },
    barChartNavContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 10,
    },
    barChartLabel: {
        color: 'black',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '600',
        padding: 5,
        borderRadius: 5,
    },
    yAxisText: {
        color: 'black',
        fontSize: 12,
        fontWeight: "bold",
    },
    xAxisText: {
        color: 'black',
        fontSize: 12,
        fontWeight: "bold",
        textAlign: 'center',
    },
    columnLabelsContainer: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: 20,
        paddingHorizontal: 10,
        rowGap: 5,
        marginBottom: 20,
    },
    labelContainer: {
        display: 'flex',
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelText: {
        flexWrap: 'wrap',
        marginRight: 5,
        fontWeight: '600',
    },
    labelCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },

});

export default HistoricBarChart;
