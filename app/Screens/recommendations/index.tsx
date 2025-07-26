import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import {Stack} from "expo-router";
import {fetchProfile} from "@/app/Services/UserService/user-service";
import {showToastError} from "@/app/Services/ToastService/toast-service";
import User from "@/app/Services/UserService/user";
import colors from "@/app/Constants/colors";
import modalStyles from "@/app/Global/ModalStyles";
import {CertificateDTO, Recommendation, RecommendationsResult} from "@/app/Constants/types";
import {RecommendationCard} from "@/app/Components/RecommendationCard";
import "@/i18n";
import {useTranslation} from "react-i18next";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import SelectModal from "@/app/Components/SelectModal";
import {
    fetchFinalRecommendationValues,
    getRecommendationsForCertificate
} from "@/app/Services/RecommendationsService/recommendations";

interface CostRowProps {
    name: string;
    cost: number;
    additionalStyles?: ViewStyle;
}
const CostRow: React.FC<CostRowProps> = ({ name, cost }) => (
    <View style={styles.costRow}>
        <Text style={styles.cardText}>{name}</Text>
        <Text style={styles.cardText}>{cost}</Text>
    </View>
);

const screenWidth = Dimensions.get("window").width;

export default function Index() {
    const [modalVisible, setModalVisible] = useState(false);
    const [certificates, setCertificates] = useState<CertificateDTO[]>([]);
    const [selectedCertificate, setSelectedCertificate] = useState<CertificateDTO | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false); //for when certificates of user is loading
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false); //for when recommendations are loading
    const [selectedRecommendations, setSelectedRecommendations] = useState<Recommendation[]>([]);
    //TODO should be an object with ALL the results, but idk how they are calculated
    const [globalResults, setGlobalResults] = useState<RecommendationsResult>();

    const { t } = useTranslation();

    const handleSelectCertificatePress = async () => {
        setIsLoadingProfile(true);
        //clear everything when selectin a new certificate
        setRecommendations(null);
        setSelectedCertificate(null);
        try {
            const user: User = await fetchProfile();

            if (user && user.certificateDTOList && user.certificateDTOList.length > 0) {
                setCertificates(user.certificateDTOList);
                setModalVisible(true);
            } else if (user && (!user.certificateDTOList || user.certificateDTOList.length === 0)) {
                showToastError("Error", t("noCertificatesFound"));
            }
        }
        catch {
            showToastError("Error", t("failedProfileFetch"));
        }
        finally {
            setIsLoadingProfile(false);
        }
    };

    const handleCertificateSelect = (certificate: CertificateDTO) => {
        setSelectedCertificate(certificate);
        setModalVisible(false);
    };

    //triggers on selected recommendations changes
    useEffect(() => {
        //reset results if no recommendations selected
        if (selectedRecommendations.length === 0) {
            setGlobalResults(undefined);
            return;
        }

        const fetchResults = async () => {
            try {
                const apiResults = await fetchFinalRecommendationValues(
                    selectedCertificate?.certificateId,
                    selectedRecommendations
                );
                const mappedResults: RecommendationsResult = {
                    totalCost: apiResults.totalCost,
                    totalOldAnnualCost: Math.round(apiResults.totalOldAnnualCost * 1000),
                    totalNewAnnualCost: Math.round(apiResults.totalNewAnnualCost * 1000),
                    totalSavings: Math.round(apiResults.totalSavings * 1000),
                    qualificationNew: apiResults.qualificationNew
                };

                setGlobalResults(mappedResults);
            } catch (error) {
                let newResult: RecommendationsResult = {
                    totalCost: 0,
                    totalSavings: 0,
                    totalNewAnnualCost: 0,
                    totalOldAnnualCost: 0,
                    qualificationNew: ""
                };

                selectedRecommendations.forEach((rec) => {
                    newResult.totalCost += rec.totalPrice;
                    newResult.totalSavings += rec.upgradedAnualCost;
                });

                newResult.totalCost = Math.round(newResult.totalCost);
                newResult.totalSavings = Math.round(newResult.totalSavings);

                setGlobalResults(newResult);
            }
        };

        // Call the async function
        fetchResults();

    }, [selectedRecommendations]);

    //triggers on selectedCertificate changes
    useEffect(() => {
        const loadRecommendations = async () => {
            if (!selectedCertificate) {
                setRecommendations(null); //No recommendations if no certificate is selected
                return;
            }

            setIsRecommendationsLoading(true);
            setRecommendations(null);
            try {
                const fetchedRecommendations = await getRecommendationsForCertificate(selectedCertificate?.certificateId); //mocked by now
                setRecommendations(fetchedRecommendations);
            }
            catch {
                showToastError("Error", t("errorMessageGeneric"));
                setRecommendations([]);//no recommendations if error
            }
            finally {
                setIsRecommendationsLoading(false);
            }
        };

        loadRecommendations();

    }, [selectedCertificate]);


    const renderCertificateItem = ({ item }: { item: CertificateDTO }) => (
        <TouchableOpacity
            style={modalStyles.modalItem}
            onPress={() => handleCertificateSelect(item)}
        >
            <Text style={modalStyles.modalItemText}>{item.documentId}</Text>
        </TouchableOpacity>
    );

    const handlePressRecommendation = (recommendation: Recommendation) => {
        if (selectedRecommendations.find(r => r.name === recommendation.name))
            setSelectedRecommendations(selectedRecommendations.filter((c) => c.name !== recommendation.name));
        else setSelectedRecommendations([...selectedRecommendations, recommendation]);
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: t("recommendations") }} />
            {selectedCertificate && (
                <View style={styles.selectedContainer}>
                    <View style={styles.selectedRow}>
                        <Text style={styles.selectedTitle}>{t("selectedCertificate")}</Text>
                        <Text style={styles.selectedText}>{selectedCertificate.documentId}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleSelectCertificatePress}
                        style={[styles.button, styles.changeButton]}
                        disabled={isLoadingProfile}
                    >
                        {isLoadingProfile ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>{t("changeCertificate")}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {selectedCertificate ? (
                    <>
                        {/*recommendations*/}
                        <View style={styles.recommendationsSection}>
                            <Text style={{fontSize: 14, color: colors.grey, textAlign: "center", marginVertical: 16}}>{t("infoAboutRecommendations")}</Text>
                            {isRecommendationsLoading ? (
                                <ActivityIndicator size="large" color={colors.forestGreen} style={styles.recommendationsLoading} />
                            ) : recommendations && recommendations.length > 0 ? (
                                <View style={styles.recommendationsCards}>
                                    {recommendations.map((rec, index) => (
                                        <RecommendationCard key = {index} type={rec.type} name={rec.name} description={rec.description} totalPrice={rec.totalPrice} upgradePercentage={Math.round(rec.upgradePercentage * 100) / 100}
                                                            upgradedAnualCost={rec.upgradedAnualCost} upgradedICEE={rec.upgradedICEE} recommendationId={rec.recommendationId}
                                                            onPress={() => handlePressRecommendation(rec)} selected={!!selectedRecommendations.find(r => r.name === rec.name)} />
                                    ))}
                                </View>
                            ) : recommendations && recommendations.length === 0 ? (
                                <Text style={styles.recommendationsEmptyText}>{t("noRecommendations")}</Text>
                            ) : (
                                <Text style={styles.recommendationsEmptyText}>{t("errorMessageGeneric")}</Text>
                            )}
                        </View>
                        {selectedRecommendations.length > 0 && (
                            <View style={styles.resultsContainer}>
                                <Text style={[styles.sectionTitle, styles.overallTitle]}>{t("overallResult")}</Text>
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>{t("estimatedCost")}</Text>
                                    {selectedRecommendations.map((rec, index) => (
                                        <CostRow key={index} name={t(`recommendationTexts.${rec.name}.name`)} cost={rec.totalPrice} />
                                    ))}
                                    <View style={[styles.costRow, { borderTopWidth: 1, borderColor: colors.grey }]}>
                                        <Text style={styles.cardTextBold}>{t("totalAmount")}</Text>
                                        <Text style={[styles.cardTextBold]}>{globalResults?.totalCost}€</Text>
                                    </View>
                                </View>

                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>{t("estimatedImprovement")}</Text>
                                    <View style={styles.improvRow}>
                                        <Text style={[styles.grade, styles.gradeGreen]}>{globalResults?.qualificationNew}</Text>
                                    </View>
                                </View>

                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>{t("estimatedSavings")}</Text>
                                    <View style={styles.improvRow}>
                                        <Text style={[styles.amount, styles.amountRed]}>{globalResults?.totalOldAnnualCost}€</Text>
                                        <MaterialCommunityIcons name={"arrow-right-bold"} size={60} />
                                        <Text style={[styles.amount, styles.amountGreen]}>{globalResults?.totalNewAnnualCost}€</Text>
                                    </View>
                                    <View style={styles.improvRow}>
                                        <Text style={[styles.amount, {backgroundColor: colors.forestGreen}]}>{globalResults?.totalSavings}€</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={handleSelectCertificatePress}
                        style={[styles.button, isLoadingProfile && styles.buttonDisabled, {marginTop: 10}]}
                        disabled={isLoadingProfile}
                    >
                        {isLoadingProfile ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}>Select Certificate for recommendations</Text>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
            <SelectModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                data={certificates}
                renderItem={renderCertificateItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
        paddingTop: 0,
        padding: 4,
    },
    button: {
        backgroundColor: colors.darkGreen,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 180,
        minHeight: 50,
    },
    buttonDisabled: {
        backgroundColor: "#cccccc",
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    //container for Selected Cert + Change Button (appears at the top)
    selectedContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        paddingVertical: 10,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        width: '100%',
    },

    selectedRow: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    selectedTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    selectedText: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#333',
        marginBottom: 2,
        textAlign: 'center'
    },
    changeButton: {
        backgroundColor: colors.forestGreen,
        marginTop: 4,
        minWidth: 180,
    },
    recommendationsSection: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 2,
    },
    recommendationsCards: {
        width: screenWidth * 0.9,
        paddingHorizontal: 5,
    },
    recommendationItem: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    recommendationText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 20,
    },
    recommendationsLoading: {
        marginTop: 30,
    },
    recommendationsEmptyText: {
        marginTop: 30,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },

    resultsContainer: {
        maxWidth: '100%',
        marginTop: 20,
        backgroundColor: colors.darkGreen,
        paddingTop: 20,
        paddingHorizontal: 16,
        borderRadius: 20,
    },

    overallTitle: {
        fontSize: 28,
        marginBottom: 20,
        alignSelf: 'center',
        color: colors.subtleWhite,
    },

    card: {
        marginBottom: 20,
        backgroundColor: colors.subtleWhite,
        padding: 16,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        elevation: 5,
    },
    cardTitle: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    cardText: {
        fontSize: 16,
    },
    cardTextBold: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    improvRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
    },
    grade: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        width: 60,
        height: 60,
        textAlign: 'center',
        lineHeight: 60,
        borderRadius: 20,
    },
    gradeRed: {
        backgroundColor: colors.wrong,
    },
    gradeGreen: {
        backgroundColor: colors.right,
    },
    amount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    amountRed: {
        backgroundColor: '#ff7f7f',
    },
    amountGreen: {
        backgroundColor: '#7fcc7f',
    },
});