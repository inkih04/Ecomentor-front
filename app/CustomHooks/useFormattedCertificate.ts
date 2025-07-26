import deserializeFormattedCertificate from "../Utils/certificate/serializer";
import { useCertificate, useCertificates, CertificateFetchProps, CertificateListFetchProps } from "./useCertificate";

type FormattedCertificateFetchProps = CertificateFetchProps;

export const useFormattedCertificate = function (props : FormattedCertificateFetchProps) {
    const { certificateData } = useCertificate(props);
    const formattedCertificateData = certificateData === undefined ? undefined : deserializeFormattedCertificate(certificateData) 

    return {
        formattedCertificateData,
    }
}

type FormattedCertificateListFetchProps = CertificateListFetchProps;

export const useFormattedCertificateList = function(props: FormattedCertificateListFetchProps) {
    const { certificateData } = useCertificates(props);
    const formattedCertificateData = certificateData === undefined ? undefined :
        certificateData.map(data => deserializeFormattedCertificate(data));
    
    const mappedData = new Map<number, Record<string, string>>(formattedCertificateData !== undefined ? formattedCertificateData.map(data => 
        [parseInt(data.certificateId), data]) : []);

    return {
        formattedCertificateData,
        getById: (id: number) => { return mappedData.get(id) }
    }
}