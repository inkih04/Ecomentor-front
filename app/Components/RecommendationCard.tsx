import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from "@/app/Constants/colors";
import {Recommendation} from "@/app/Constants/types";
import "@/i18n";
import {useTranslation} from "react-i18next";
import recommendationTypes from "@/app/Constants/recommendationsTypes.json";

interface RecommendationCardProps extends Recommendation {
    selected: boolean;
    onPress: () => void;
}

//necessary to not get TS error
type IconName = 'wall' | 'solar-panel' | 'window-closed-variant' | 'printer-3d-nozzle-heat' | 'leaf' | 'air-filter' | 'lightbulb-on-outline' | 'weather-sunny-alert' | 'fire' | 'earth' | 'ev-station' | 'fan' | 'snowflake' | 'water-boiler' | 'home-modern' | 'tools' | 'home-automation' | 'help-circle';
const types: Record<string, IconName> = {
    INSULATION: "wall",
    SOLAR: "solar-panel",
    WINDOWS: "window-closed-variant",
    HEAT_PUMP: "printer-3d-nozzle-heat",
    BIOMASS: "leaf",
    HVAC: "air-filter",
    LIGHTING: "lightbulb-on-outline",
    SOLAR_THERMAL: "weather-sunny-alert",
    DISTRICT_HEATING: "fire",
    GEOTHERMAL: "earth",
    EV_CHARGING: "ev-station",
    VENTILATION: "fan",
    REFRIGERATION: "snowflake",
    WATER_HEATING: "water-boiler",
    REHABILITATION: "home-modern",
    COMMISSIONING: "tools",
    SMART_CONTROL: "home-automation",
    default: "help-circle"
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({type, name, description, totalPrice, upgradePercentage, upgradedAnualCost, upgradedICEE, onPress, selected}) => {

    const getProgressBarColor = (upgradeValue:number) => {
        if (upgradeValue < 33) return '#FF6347';
        if (upgradeValue < 66) return '#FFA500';
        return colors.forestGreen;
    }

    const progressBarColor = getProgressBarColor(upgradePercentage);
    const { t } = useTranslation();
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                selected ? {
                    borderWidth: 2,
                    borderColor: colors.forestGreen,
                    padding: 14
                } : null
            ]}
        >
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                    name={types[recommendationTypes[name as keyof typeof recommendationTypes]] || types.default}
                    size={30}
                />
                <Text style={styles.title}>{t(`recommendationTexts.${name}.name`)}</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.description}>{t(`recommendationTexts.${name}.description`)}</Text>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.unimportant}>{t("estimatedImprovement")}: </Text>
                        <Text style={styles.important}>{upgradePercentage}%</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.unimportant} >{t("estimatedCost")}: </Text>
                        <Text style={styles.important}>{totalPrice}€</Text>
                    </View>
                </View>
            </View>
            <View style={styles.bottomSection}>
                <Text style={styles.unimportant}>{t("costImprovementRelation")}</Text>
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarTrack}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${upgradePercentage}%`, backgroundColor: progressBarColor },
                            ]}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        backgroundColor: colors.subtleWhite,
        padding: 16,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        elevation: 5,
    },
    cardHeader: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        marginBottom: 18,
    },
    title: {
        marginLeft: 4,
        fontSize: 22,
        fontWeight: "bold",
    },
    cardContent: {
        marginBottom: 18,
    },
    description: {
        fontSize: 18,
        textAlign: "center",
        alignSelf: "center",
        marginBottom: 18,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    col: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    unimportant: {
        color: colors.grey,
        fontSize: 14,
        fontWeight: "400",
    },
    important: {
        fontSize: 16,
        fontWeight: "600",
    },
    bottomSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    progressBarContainer: {
        marginTop: 8,
        flex: 1,
        alignSelf: "center",
        width: '80%',
    },
    progressBarTrack: {
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
})