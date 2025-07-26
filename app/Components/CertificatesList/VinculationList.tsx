import React from "react"

import CertificatesList from "../CertificatesList"
import { vinculateOfficialCertificate } from "../../Services/certificates/service"


interface VinculationListProps {
    userId: number,                 // The userid whom the certificates are to be vinculated
    certificateIds: number[],       // The list of certificates to be displayed identified by their certificateId
}

/**
 * Component representing a view to vinculate the displayed certificates to an user.
 * Uses a CertificatesList as a base
 */
export const VinculationList: React.FC<VinculationListProps> = (props) => {
    const onCertificatePress = (data: object) => {
        vinculateOfficialCertificate(props.userId, (data as {documentId: number}).documentId);
    }

    return (<CertificatesList 
            certificateIDs={props.certificateIds} 
            onCertificatePress={onCertificatePress}/>)
}

export default VinculationList;