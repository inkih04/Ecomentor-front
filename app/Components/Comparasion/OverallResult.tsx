import React from "react"
import { View, Text, StyleSheet } from "react-native"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import colors from "@/app/Constants/colors"
import {buildEmissionsComparisonData} from "@/app/Utils/comparisonUtils";
import {CertificateInfo} from "@/app/Constants/types";
import {useTranslation} from "react-i18next";

//TODO let less emissions and less consumed energy

interface OverallResultProps {
    cert1: CertificateInfo;
    cert2: CertificateInfo;
    co1: number;
    co2: number;
    features: Record<string, { cert1Value: boolean; cert2Value: boolean }>
    address1: string
    address2: string
}

//Used to improve comparison compute
const weights = {
    emissions: 0.4,
    consumption: 0.4,
    features: 0.2
};
//Features to search since they are considered for the EcoPoints
const relevantKeys = ["betterRefrigeration", "betterEnergyQualification", "districtHeating", "biomassEnergy", "solarEnergy"];


const calculateScore = (emissions: number, consumption: number, features: number) => {
    return emissions * weights.emissions + consumption * weights.consumption + features * weights.features;
}

export const OverallResult = ({cert1, cert2, co1, co2, features, address1, address2}: OverallResultProps) => {
    const { t } = useTranslation();
    const { heatingEmissions1, heatingEmissions2, refrigerationEmissions1, refrigerationEmissions2, primaryEnergyConsumption1, primaryEnergyConsumption2 } = buildEmissionsComparisonData(cert1, cert2);

    const totalEmissions1 = heatingEmissions1 + refrigerationEmissions1 + co1;
    const totalEmissions2 = heatingEmissions2 + refrigerationEmissions2 + co2;

    // 0,5 ONLY IF TIE
    const emissionsScore = totalEmissions1 < totalEmissions2 ? { cert1: 1, cert2: 0 } : totalEmissions2 < totalEmissions1 ? { cert1: 0, cert2: 1 } :
            { cert1: 0.5, cert2: 0.5 };

    const consumptionScore = primaryEnergyConsumption1 < primaryEnergyConsumption2 ? { cert1: 1, cert2: 0 } : primaryEnergyConsumption2 < primaryEnergyConsumption1 ? { cert1: 0, cert2: 1 } : { cert1: 0.5, cert2: 0.5 };
    // COunting eco features (such as better heating etc...)
    const points1 = relevantKeys.filter(key => features[key]?.cert1Value).length;
    const points2 = relevantKeys.filter(key => features[key]?.cert2Value).length;
    const featuresScore = points1 > points2 ? { cert1: 1, cert2: 0 } : points2 > points1 ? { cert1: 0, cert2: 1 } :
            { cert1: 0.5, cert2: 0.5 };

    const lessEmissions = (heatingEmissions1 + refrigerationEmissions1 + co1) < (heatingEmissions2 + refrigerationEmissions2 + co2) ? 1 : 2;
    const lessEnergy = primaryEnergyConsumption1 < primaryEnergyConsumption2 ? 1 : 2;

    const totalScore1 = calculateScore(emissionsScore.cert1, consumptionScore.cert1, featuresScore.cert1);

    const totalScore2 = calculateScore(emissionsScore.cert2, consumptionScore.cert2, featuresScore.cert2);


    let overallWinner;
    if (totalScore1 > totalScore2) {
        overallWinner = 1;
    }
    else if (totalScore2 > totalScore1) {
        overallWinner = 2;
    }
    else {
        // When tied, prioritize emissions as the tiebreaker
        overallWinner = totalEmissions1 <= totalEmissions2 ? 1 : 2;
    }

    const winnerAddress = overallWinner === 1 ? address1 : address2
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{winnerAddress.toUpperCase()} {t("moreEco")}</Text>

            <View style={styles.iconRow}>
                <View style={styles.iconBlock}>
                    <MaterialCommunityIcons
                        name="leaf"
                        size={32}
                        color={overallWinner === 1 ? colors.right : colors.wrong}
                    />
                    <Text style={[styles.iconLabel, overallWinner === 1 && styles.bold]}>
                        {address1}
                    </Text>
                </View>
                <View style={styles.iconBlock}>
                    <MaterialCommunityIcons
                        name="leaf"
                        size={32}
                        color={overallWinner === 2 ? colors.right : colors.wrong}
                    />
                    <Text style={[styles.iconLabel, overallWinner === 2 && styles.bold]}>
                        {address2}
                    </Text>
                </View>
            </View>

            <View style={styles.summary}>
                <View style={{flexDirection: "row", gap: "8"}}>
                    <Text style={styles.bullet}>• {t("ecoPoints")}</Text>
                    <Text>{overallWinner === 1 ? points1 : points2}</Text>
                </View>
                <View style={{flexDirection: "row", gap: "8"}}>
                    <Text style={styles.bullet}>• {t("bestEmi")} </Text>
                    <Text>{lessEmissions === 1 ? address1 : address2}</Text>
                </View>
                <View style={{flexDirection: "row", gap: "8"}}>
                    <Text style={styles.bullet}>• {t("bestCons")} </Text>
                    <Text>{lessEnergy === 1 ? address1 : address2}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 20,
        elevation: 4,            // sombra Android
        shadowColor: "#000",     // sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 12,
        color: colors.forestGreen
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 16
    },
    iconBlock: {
        alignItems: "center"
    },
    iconLabel: {
        marginTop: 4,
        fontSize: 14,
        color: "#333"
    },
    bold: {
        fontWeight: "700",
        color: colors.right,
        fontSize: 16,
    },
    summary: {
        borderTopWidth: 1,
        borderTopColor: colors.subtleWhite,
        paddingTop: 12
    },
    bullet: {
        fontSize: 16,
        marginBottom: 6,
        color: "black",
        fontWeight: "600",
    }
})
