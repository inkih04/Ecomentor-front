import React, {useState} from "react";
import CertificatesList from "@/app/Components/CertificatesList";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import colors from "@/app/Constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useTranslation} from "react-i18next";

export interface ProfileCertificatesProps {
    certificates: number[];
    onCertificateVinculate: (documentCaseNumber: string) => void;
}

const ProfileCertificates: React.FC <ProfileCertificatesProps> = ( {certificates, onCertificateVinculate}) => {
    const [documentCaseNumber, setDocumentCaseNumber] = useState<string>("");
    const { t } = useTranslation();
    const onCertificatePress = () => {
        if (documentCaseNumber.trim() !== "") {
            onCertificateVinculate(documentCaseNumber);
            setDocumentCaseNumber("");
        }
    };

    return (
        <View style={{display: "flex", flexDirection: "column", justifyContent:"space-between", alignItems:"center"}}>
            <View style={{height: "90%"}}>
                <CertificatesList certificateIDs={certificates}/>
            </View>

            <View style={styles.bottomContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t("bindDocument")}
                    value={documentCaseNumber}
                    onChangeText={setDocumentCaseNumber}
                    onSubmitEditing={onCertificatePress}
                />
                <TouchableOpacity style={styles.button} onPress={onCertificatePress}>
                    <AntDesign name="link" size={24} color="white"/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProfileCertificates;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 15,
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        color: colors.darkGreen,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        height: 40,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.darkGreen,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 8,
    }
});
