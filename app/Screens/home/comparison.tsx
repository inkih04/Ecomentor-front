import {ScrollView, StyleSheet, Text, View} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import {CertificateInfo} from "@/app/Constants/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "@/app/Constants/colors";
import {buildComparisonData, buildEmissionsComparisonData} from "@/app/Utils/comparisonUtils";
import React from "react";
import "@/i18n";
import {useTranslation} from "react-i18next";
import {getComparisonColor} from "@/app/Utils/commonUtils";
import {OverallResult} from "@/app/Components/Comparasion/OverallResult";
//Needed to avoid TS error when getting ceftificates from localSearchParams
const parseCertificate = (cert: string | string[]): CertificateInfo => {
    if (Array.isArray(cert)) cert = cert[0];
    return JSON.parse(cert) as CertificateInfo;
};

//Returns color based on values AND condition
const FeatureComparisonItem = ({
                                   feature,
                                   cert1Value,
                                   cert2Value,
                                   isLowerBetter = false,
                                   icon
                               }: {
    feature: string;
    cert1Value: boolean;
    cert2Value: boolean;
    isLowerBetter?: boolean;
    icon: React.ReactNode;
}) => {
    const building1Color = cert1Value ? colors.right : colors.wrong;
    const building2Color = cert2Value ? colors.right : colors.wrong;

    return (
        <View style={styles.featureComparisonRow}>
            <View style={[styles.indicatorCircle, { backgroundColor: building1Color }]}>
                {cert1Value ?
                    <MaterialCommunityIcons name="check" size={24} color="white" /> :
                    <MaterialCommunityIcons name="close" size={24} color="white" />
                }
            </View>

            <View style={styles.featureMiddle}>
                {icon}
                <Text style={styles.featureText}>{feature}</Text>
            </View>

            <View style={[styles.indicatorCircle, { backgroundColor: building2Color }]}>
                {cert2Value ?
                    <MaterialCommunityIcons name="check" size={24} color="white" /> :
                    <MaterialCommunityIcons name="close" size={24} color="white" />
                }
            </View>
        </View>
    );
};

const TableRow = ({ label, cert1Value, cert2Value }: { label: string; cert1Value: number | boolean; cert2Value: number | boolean }) => {
    const building1Color = getComparisonColor(cert1Value, cert2Value, true);
    const building2Color = getComparisonColor(cert2Value, cert1Value, true);

    return (
        <View style={styles.tableRow}>
            <View style={styles.firstColumn}>
                <Text style={styles.tableContent}>{label}</Text>
            </View>
            <View style={[styles.valueColumn, {backgroundColor: building1Color}]}>
                <Text style={styles.tableContent}>{cert1Value}</Text>
            </View>
            <View style={[styles.valueColumn, {backgroundColor: building2Color}]}>
                <Text style={styles.tableContent}>{cert2Value}</Text>
            </View>
        </View>
    )
};



const EmissionsTable = ({ cert1, cert2 }: { cert1: CertificateInfo; cert2: CertificateInfo }) => {
    const { t } = useTranslation();
    const { heatingEmissions1, heatingEmissions2, refrigerationEmissions1, refrigerationEmissions2, primaryEnergyConsumption1, primaryEnergyConsumption2, buildingArea1, buildingArea2 } = buildEmissionsComparisonData(cert1, cert2);
    return (
        <View style={styles.tableContainer}>
            <View style={styles.tableHead}>
                <View style={styles.firstColumn}>
                    <Text style={styles.tableCaption}>{t("category")}</Text>
                </View>
                <View style={styles.valueColumn}>
                    <Text style={styles.tableCaption}>{cert1.shortAddress}</Text>
                </View>
                <View style={styles.valueColumn}>
                    <Text style={styles.tableCaption}>{cert2.shortAddress}</Text>
                </View>
            </View>
            <TableRow label={t("heatingCategory")} cert1Value={heatingEmissions1} cert2Value={heatingEmissions2}/>
            <TableRow label={t("refrigerationCategory")} cert1Value={refrigerationEmissions1} cert2Value={refrigerationEmissions2}/>
            <TableRow label={"ACS"} cert1Value={primaryEnergyConsumption1} cert2Value={primaryEnergyConsumption2}/>
            <TableRow label={t("energyCategory")} cert1Value={buildingArea1} cert2Value={buildingArea2}/>
        </View>
    );
};


export default function Index() {
    const { cert1, cert2 } = useLocalSearchParams();
    const { t } = useTranslation();

    // we get the params from home
    const certificate1: CertificateInfo = parseCertificate(cert1)
    const certificate2: CertificateInfo = parseCertificate(cert2)
    const { co2Qual1, co2Emiss1, co2Qual2, co2Emiss2, features } = buildComparisonData(certificate1, certificate2);
    // we decide which color each CO2 etiquete gets
    const co1IsBetter = co2Emiss1 < co2Emiss2;
    const co2IsBetter = co2Emiss2 < co2Emiss1;
    const sameCO2 = co2Emiss1 === co2Emiss2;
    const co1Color = sameCO2 ? "gray" : (co1IsBetter ? colors.right : colors.wrong);
    const co2Color = sameCO2 ? "gray" : (co2IsBetter ? colors.right : colors.wrong);
    if (!cert1 || !cert2) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Missing certificates for comparison.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 2 }}>
            <Stack.Screen options={{ title: "Comparison" }} />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.section}>
                    <View style={styles.certColumn}>
                        <View style={styles.buildingAddress}>
                            <Text style={styles.addressText}>{certificate1.shortAddress}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <View style={styles.buildingCircle}>
                                <MaterialCommunityIcons name={"office-building-marker"} size={76} color={colors.subtleWhite}/>
                            </View>
                        </View>
                        <View style={[styles.CO2Info, {backgroundColor: co1Color}]}>
                            <Text style={styles.qual}>{co2Qual1}</Text>
                            <Text style={{color: colors.subtleWhite, fontWeight: "bold"}}>{co2Emiss1}kgCO2</Text>
                        </View>
                    </View>
                    <View style={styles.certColumn}>
                        <View style={styles.buildingAddress}>
                            <Text style={styles.addressText}>{certificate2.shortAddress}</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <View style={styles.buildingCircle}>
                                <MaterialCommunityIcons name={"office-building-marker"} size={76} color={colors.subtleWhite}/>
                            </View>
                        </View>
                        <View style={[styles.CO2Info, {backgroundColor: co2Color}]}>
                            <Text style={styles.qual}>{co2Qual2}</Text>
                            <Text style={{color: colors.subtleWhite, fontWeight: "bold"}}>{co2Emiss2}kgCO2</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.featuresContainer}>
                    {Object.entries(features).map(([key, feature]) => (
                        <FeatureComparisonItem
                            key={key}
                            feature={feature.title}
                            cert1Value={feature.cert1Value}
                            cert2Value={feature.cert2Value}
                            icon={feature.icon}
                        />
                    ))}
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons name={"cloud"} color={colors.forestGreen} size={36} />
                    <Text style={styles.sectionHeader}>{t("overallEmissions")}</Text>
                </View>
                <EmissionsTable
                    cert1={certificate1}
                    cert2={certificate2}
                />
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <MaterialCommunityIcons name={"chart-gantt"} color={colors.forestGreen} size={36} />
                    <Text style={styles.sectionHeader}>{t("overallResult")}</Text>
                </View>
                <OverallResult
                    cert1={certificate1}
                    cert2={certificate2}
                    co1={co2Emiss1}
                    co2={co2Emiss2}
                    features={features}
                    address1={certificate1.shortAddress}
                    address2={certificate2.shortAddress}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    certColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems:"center"
    },
    middleCompare: {

    },
    featuresContainer: {
        marginVertical: 20,
    },
    featureComparisonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    indicatorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    featureMiddle: {
        backgroundColor: colors.yellowishGreen,
        padding: 10,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        width: "60%",
    },
    featureText: {
        fontWeight: "bold",
        marginLeft: 10,
    },
    CO2Info: {
        padding: 6,
        borderRadius: 12,
        display: "flex",
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    buildingAddress: {
        marginBottom: "auto",
        borderRadius: 16,
        backgroundColor: colors.subtleWhite,
        padding: 6,
        elevation: 3,
        flexDirection: "row",
        alignItems: "center",
    },
    addressText: {
        color: colors.darkGreen,
        padding: 8,
        fontWeight: "600",
        fontSize: 14,
        flex: 1,
        textAlign: "center",
    },
    buildingCircle: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: colors.forestGreen,
        marginTop: 4,
        marginBottom: 10,
    },
    qual: {
        marginRight: 4,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.subtleWhite,
        borderRightWidth: 4,
        paddingRight: 4,
        borderRightColor: colors.subtleWhite,
    },
    //table styles
    tableContainer: {
        width: '100%',
        marginVertical: 10,
    },
    tableHead: {
        flexDirection: "row",
        backgroundColor: colors.forestGreen,
        alignItems: "center",
        padding: 15,
        width: '100%',
    },
    tableRow: {
        flexDirection: "row",
        padding: 15,
        width: '100%',
    },
    firstColumn: {
        width: "30%",
        paddingRight: 10,
    },
    valueColumn: {
        width: "35%",
    },
    tableCaption: {
        color: colors.subtleWhite,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    tableContent: {
        color: "black",
        textAlign: "center",
    },
    sectionHeader: {
        fontSize: 26,
        marginLeft: 8,
        color: colors.forestGreen,
        borderBottomWidth: 4,
        borderBottomColor: colors.forestGreen,
    }
});