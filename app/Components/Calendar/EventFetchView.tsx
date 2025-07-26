import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import RadioButtonView from "../Form/RadioButtonView";
import { useState } from "react";
import { EventFetchType, UseEventProps } from "@/app/CustomHooks/useEvent";
import { useLocationPermission } from "@/app/CustomHooks/locationPermissionHook";
import CustomPicker from "../CustomPicker";
import CustomButton from "../CustomButton";
import colors from "@/app/Constants/colors";
import { getCertificateLabel } from "@/app/Utils/certificate/certificate";


interface EventFetchViewProps {
    certificates?: Record<string, any>[];
    onFetchSelected: (fetchType: UseEventProps) => void;
}

export const EventFetchView = ({ onFetchSelected, certificates }: EventFetchViewProps) => {
    const { t } = useTranslation();
    const hasPermission = useLocationPermission();
    const [fetchType, setFetchType] = useState<EventFetchType>('barcelona');
    const [certificateId, setCertificateId] = useState<number | null>(null);

    const radioButtons: { label: string, key: string }[] = [
        { label: t('nearBarcelona'), key: 'barcelona' },
    ];

    if (hasPermission) radioButtons.push({ label: t('nearYou'), key: 'location' });
    if (certificates) radioButtons.push({ label: t('nearCertificate'), key: 'certificate' });


    const handleOnFetchSelected = function () {
        if (fetchType == 'barcelona') {
            onFetchSelected({ barcelona: true });
        } else if (fetchType == 'location' && hasPermission) {
            onFetchSelected({ userLocation: true })
        } else if (fetchType == 'certificate' && certificateId !== null) {
            onFetchSelected({ certificateId });
        }
    };

    const handleOnCertificateSelected = function (filterType: string, value: string) {
        setCertificateId(parseInt(value));
    }

    const pickerData: { name: string, value: string }[] | undefined = certificates ?
        certificates.map((certificate) => {
            return {
                name: getCertificateLabel(certificate),
                value: (certificate.certificateId as number).toString(),
            };
        })
        : undefined;

    return <View style={styles.view}>
        <RadioButtonView
            label={t('getEventsByLocation')}
            buttons={radioButtons}
            onPress={(key: string | null) => setFetchType(key as EventFetchType)}
            required
        />
        {
            fetchType == 'certificate' && pickerData ?
                <CustomPicker
                    label={t('certificates')}
                    data={pickerData}
                    selectedValue={""}
                    filterName={""}
                    onValueChange={handleOnCertificateSelected}
                />
                : <></>
        }
        <CustomButton title={t('loadEvents')} onPress={handleOnFetchSelected} style={{
            unselected: { backgroundColor: colors.forestGreen },
        }} />
    </View>
}

const styles = StyleSheet.create({
    view: {
    },
});

export default EventFetchView;