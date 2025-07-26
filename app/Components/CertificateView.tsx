import React, { useState } from "react"
import { PressableProps, View, Text, StyleSheet } from "react-native"

import { OneOf } from "@/app/Utils/type";
import InfoCard from "./InfoCard";
import { CertificateColorMap } from "../Constants/certificates/qualifications";
import AddressCardView from "./Certificate/AddressCardView";
import { useFormattedCertificate } from "../CustomHooks/useFormattedCertificate";
import { useTranslation } from "react-i18next";


type DataRetrieveType = OneOf<{
    fetchId: number;
    data: Record<string, string>;
}>;

type DisplayMode = 'brief' | 'section';

interface CertificateViewProps {
    retrieveType: DataRetrieveType;
    pressable?: PressableProps;
}


export const CertificateView: React.FC<CertificateViewProps> = ({ retrieveType, pressable }) => {
    const { t } = useTranslation();
    const data = retrieveType.fetchId !== undefined ? useFormattedCertificate({ id: retrieveType.fetchId}).formattedCertificateData :
        retrieveType.data; 
    
    const [backgroundColor, setBackgroundColor] = useState('#f2f6eb');

    const onPressIn = () => setBackgroundColor('#afc884');
    const onPressOut = () => setBackgroundColor('#f2f6eb');

    if (data === undefined)
        return (<InfoCard title={"Loading"}/>)

    return (<InfoCard
        title={data.documentId ?? `${t('unofficial')} #${data.certificateId}`}
        icon={<QualificationIcon qualification={data.nonRenewablePrimaryQualification} />}
        customItems={<AddressCardView data={data} />}
        pressableProps={{ ...pressable, onPressIn, onPressOut }}
        isAccordionEnabled={false}
        style={{ 
            view: { marginBottom: 10, backgroundColor, minWidth: 250, }, 
            title: { marginLeft: 15}, 
            titleContainer: { backgroundColor}, 
            container: {backgroundColor}
        }}
    />);
}

const QualificationIcon: React.FC<{ qualification: string | undefined }> = ({ qualification }) => {
    return (<View style={styles.certificateIconWrapper}><View style={[styles.certificateIcon, getIconColorStyle(qualification)]}>
        <Text style={styles.certificateLetter}>{qualification !== undefined ? qualification : ''}</Text>
    </View></View>)
};

const getIconColorStyle = (letter: string | undefined) => {
    if (letter === undefined)
        return  { backgroundColor: '#ee100f' }

    const color = CertificateColorMap.get(letter) ?? '#ee100f';
    return { backgroundColor: color };
}

const styles = StyleSheet.create({
    certificateIconWrapper: {
        marginLeft: 0
    },

    certificateIcon: {
        borderRadius: 20,
        height: 40,
        width: 40,
        justifyContent: 'center'
    },

    certificateLetter: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: '900'
    }
});


export default CertificateView;