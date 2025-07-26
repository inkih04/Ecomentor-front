import React from "react";
import { View, ScrollView, Text } from "react-native"
import { useRouter } from "expo-router";

import { useTranslation } from "react-i18next";


import { useFormattedCertificateList } from "../CustomHooks/useFormattedCertificate";
import CertificateView from "./CertificateView";


interface CertificatesListProps {
    certificateIDs: number[],                       // The list of certificates to be displayed identified by their certificateId
    onCertificatePress?(data: object): void,        // Called when a certificate is pressed. 
                                                    // data is an object contaning all the attributes of a certificate (no nested objects)
    enableDetailsNavigation?: boolean,              // Indicates whether a long press on a certificate open its details screen. By default, its true. 
}

/**
 *  Component used to display a list of certificates with abreviated data with custom defined behaviour.
 *  Default behaviour allows for opening their details screen on press
 */
const CertificatesList: React.FC<CertificatesListProps> = (props) => {
    const router = useRouter();
    const { formattedCertificateData } = useFormattedCertificateList({ byUser: true });

    const hasNavigation = props.enableDetailsNavigation ?? true;

    const onPress = props.onCertificatePress;
    const onLongPress = (data: Record<string, string>) => {
        if (!hasNavigation) return;

        router.push({ pathname: "/Screens/certificates/details", params: { data: JSON.stringify(data) }})
    };

    return (<ScrollView>
        { formattedCertificateData === undefined ? <Text>Loading...</Text> :
            formattedCertificateData.map((data) => {
                return (
                <CertificateView
                    key={data.certificateId}
                    retrieveType={{data}}
                    pressable={{onPress, onLongPress: () => onLongPress(data)}}
                />);
            }) 
        }
    </ScrollView>)
};


export default CertificatesList;


