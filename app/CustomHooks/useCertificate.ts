import { useEffect, useState } from "react";
import { OneOf } from "@/app/Utils/type";
import { fetchAllUserCertificates, fetchCertificateData } from "../Services/certificates/service";

export type CertificateFetchProps = OneOf<{
    id: number;
}>

export const useCertificate = function ({ id } : CertificateFetchProps) {
    const [certificateData, setCertificate] = useState<Record<string, any> | undefined>(undefined);

    useEffect(() => {
        
        if (id !== undefined) {
            fetchCertificateData(id)
            .then((value) => {
                if (value === undefined) return;
                
                setCertificate(value)
            });

        }

    }, [id]);

    return {
        certificateData
    }

}

export type CertificateListFetchProps = OneOf<{
    byUser: boolean;
}>

export const useCertificates = function ({ byUser }: CertificateListFetchProps) {
    const [certificateData, setCertificate] = useState<Record<string, any>[] | undefined>(undefined);
    const mappedData = new Map<number, Record<string, any>>(certificateData !== undefined ? certificateData.map(data => 
        [data.certificateId, data]) : []);

    useEffect(() => {
        if (byUser) {
            fetchAllUserCertificates()
            .then((value) => {
                if (value === undefined) return;
                
                setCertificate(value)
            });
        }
    }, [byUser])

    return {
        certificateData,
        getById: (id: number) => { return mappedData.get(id) }
    }
}

export default { useCertificate, useCertificates };


