import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle, Text } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { getGeolocation } from "@/app/Services/Calculate/service";

import CustomButton from "@/app/Components/CustomButton";
import colors from "@/app/Constants/colors";

import { CalculateFormViewSchema, CalculateFormSchema } from "@/app/Constants/form";
import QualificationView from "@/app/Components/Certificate/QualificationView";
import { CertificateColorMap, QualificationFieldSet, UnoQualificationValueFieldMap } from "@/app/Constants/certificates/qualifications";
import useCalculateForm from "@/app/CustomHooks/useCalculateForm";
import CalculateFormView from "@/app/Components/CalculateFormView";


export default function Index() {    
    const { t } = useTranslation();
    const calculateReturn = useCalculateForm({ form: CalculateFormViewSchema, formSchema: CalculateFormSchema, registerFields:
        ['createAddressDTO.latitude', 'createAddressDTO.longitude'],
    });

    const handleSubmitForm = () => {
        const submitForm = async () => {
            const { createAddressDTO } = calculateReturn.formResult.getValues();
            const geolocation = await getGeolocation(createAddressDTO.town);
            
            calculateReturn.formResult.setValue('createAddressDTO.latitude', geolocation?.latitude ?? 0)
            calculateReturn.formResult.setValue('createAddressDTO.longitude', geolocation?.longitude ?? 0);

            calculateReturn.submit();
        }

        submitForm();
    }

    return (
        <>
            <Stack.Screen options={{ title: "calculate" }} />
            {calculateReturn.currentState.type === 'form' ? <>
                <CalculateFormView
                    style={{ pageContainer: { marginBottom: 50 }}}
                    formResult={calculateReturn.formResult}
                    form={CalculateFormViewSchema}
                    formSchema={CalculateFormSchema} />
                <CustomButton
                    title={t("submit")}
                    onPress={handleSubmitForm}
                    enabled={!calculateReturn.isProcessing}
                    toggleable
                    style={{ buttonContainer: styles.submitContainer, selected: styles.submitSelected, unselected: styles.submitUnselected,
                        disabled: styles.buttonDisabled,
                    }}
                />
            </>
            : calculateReturn.currentState.type === 'result' && calculateReturn.currentState.data !== undefined ? <>
                <UnofficialQualificationView data={calculateReturn.currentState.data} style={{ container: { marginBottom: 120 } }} />
                <View style={styles.submitContainer}>
                    <CustomButton
                        title={t("accept")}
                        onPress={calculateReturn.accept}
                        enabled={!calculateReturn.isProcessing}
                        toggleable
                        style={{ selected: styles.submitSelected, unselected: styles.submitUnselected, disabled: styles.buttonDisabled, }}
                    />
                    <CustomButton
                        title={t("reject")}
                        onPress={calculateReturn.reject}
                        enabled={!calculateReturn.isProcessing}
                        toggleable
                        style={{ selected: styles.rejectSelected, unselected: styles.rejectUnselected, disabled: styles.buttonDisabled, }}
                    />
                </View>
            </> : <></>
            }
        </>
    );
}

interface UnofficialQualificationProps {
    data: object;

    style?: {
        container?: ViewStyle;
    }
}
const UnofficialQualificationView: React.FC<UnofficialQualificationProps> = (props) => {
    const { t } = useTranslation();
    const result: Record<string, any> = props.data;

    return <ScrollView style={props.style?.container}>
        <Text style={styles.resultsTitle}>{t("results")}</Text>
        {Array.from(QualificationFieldSet).map((field) => {
            const qualValue = result[field];
            const color = CertificateColorMap.get(qualValue) ?? 'black';
            const valueField = UnoQualificationValueFieldMap.get(field) ?? 'certificateId';
            const value = result[valueField];

            return <QualificationView key={field} field={field} title={t(field)} qualification={qualValue} value={value} color={color} />
        })}
    </ScrollView>;
};

const styles = StyleSheet.create({
    submitContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        rowGap: 10,
    },
    submitSelected: {
        backgroundColor: colors.darkGreen
    },
    submitUnselected: {
        backgroundColor: colors.forestGreen
    },
    rejectSelected: {
        backgroundColor: 'red',
    },
    rejectUnselected: {
        backgroundColor: colors.wrong,
    },
    buttonDisabled: {
        backgroundColor: 'grey',
    },
    resultsTitle: {
        textAlign: 'center',
        padding: 10,
        paddingTop: 30,

        fontSize: 30,
        fontWeight: '800',
    },
});