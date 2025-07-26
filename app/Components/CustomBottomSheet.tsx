import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useMemo} from "react";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import BottomSheetCard from "@/app/Components/BottomSheetCard";
import "@/i18n"
import {useTranslation} from "react-i18next";
import colors from "@/app/Constants/colors"
import {CertificateInfo} from "@/app/Constants/types";
interface InfoItem {
    label: string;
    value: string | number;
}

//TODO-> Instead of env and building, should be array of infoItems array and iterate through that
interface CustomBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet>;
    address: string | undefined;
    emissionsAndEnergy: InfoItem[] | undefined;
    sustainabilityFeatures: InfoItem[] | undefined;
    heatingAndCooling: InfoItem[] | undefined;
    buildingInfo: InfoItem[] | undefined;
    hasMarkerSelected: boolean | undefined;
    setCompareMode: (newState: boolean) => void;
    setFirstCertificate: (firstCertificate: CertificateInfo | undefined) => void;
    currentCertificate: CertificateInfo | undefined;
    compareMode?: boolean;
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({ bottomSheetRef, address, emissionsAndEnergy, heatingAndCooling, sustainabilityFeatures, buildingInfo, hasMarkerSelected, setCompareMode, setFirstCertificate, currentCertificate, compareMode}) => {
    const { t } = useTranslation();
    const snapPoints = useMemo(() =>
            hasMarkerSelected ? ['15%', '50%', '90.5%'] : ['10%'],
        [hasMarkerSelected]);    const [currentIndex, setCurrentIndex] = React.useState(0);
    const onChangeIndex = (index: number) => {
        // If no marker is selected, force the index to stay at 0
        if (!hasMarkerSelected && index > 0) {
            bottomSheetRef.current?.snapToIndex(0);
            return;
        }
        setCurrentIndex(index);
    }

    const handleComparePress = () => {
        setCompareMode(true);
        setFirstCertificate(currentCertificate);
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            handleIndicatorStyle={styles.indicator}
            onChange={onChangeIndex}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.contentContainer}>
                    {!hasMarkerSelected ?
                        <Text style={styles.title}>{t("mapInfo")}</Text>
                        :(
                            <>
                                {compareMode ?
                                    <Text style={[styles.address]}>{t("compareInfo")}</Text>
                                    :
                                    <Text style={styles.address}>{address}</Text>}
                                {currentIndex === 0 && (
                                    <TouchableOpacity
                                        onPress={handleComparePress}>
                                        <Text style={styles.compareButton}>{t("compare")}</Text>
                                    </TouchableOpacity>
                                )}
                                {currentIndex >= 1 && sustainabilityFeatures && emissionsAndEnergy && (
                                    <View style={styles.cardsContainer}>
                                        <BottomSheetCard
                                            icon="leaf"
                                            title= "Emissions and Energy"
                                            data={emissionsAndEnergy}/>
                                        <BottomSheetCard
                                            icon="leaf"
                                            title= "Sustainability Features"
                                            data={sustainabilityFeatures}/>
                                    </View>
                                )}
                                {currentIndex >= 2 && buildingInfo && heatingAndCooling && (
                                    <View style={styles.cardsContainer}>
                                        <BottomSheetCard
                                            icon="home"
                                            title= "Building Characteristics"
                                            data={buildingInfo}/>
                                        <BottomSheetCard
                                            icon="bomb"
                                            title= "Heating and Cooling"
                                            data={heatingAndCooling}/>
                                    </View>
                                )}
                            </>
                        )
                    }
                </View>
            </BottomSheetView>
        </BottomSheet>
)
}

const styles = StyleSheet.create({
    contentContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        width: "100%",
        height: "100%",
        padding: 0,
    },
    indicator: {
        width: 50,
        height: 5,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        width: '100%',
        paddingRight: 16,
        paddingLeft: 16,
        justifyContent: "center",
    },
    address: {
        textAlign: "center",
        marginTop: 0,
        paddingTop: 0,
        fontSize: 18,
        fontWeight: "bold",
    },
    compareButton: {
        color: "#FFFFFF",
        fontWeight: "bold",
        marginTop: 12,
        fontSize: 16,
        backgroundColor: colors.right,
        padding: 12,
        borderRadius: 12,
    }
})

export default CustomBottomSheet;

