import { useState, useEffect } from 'react';
import {
    fetchCoordinatesWithCertificateInsideRegion,
    fetchCoordinatesWithCertificateInsideRegionAndFilter
} from "@/app/Services/CertificatesService/map";
import { ProcessedAddress, FilterValue } from "@/app/Constants/types";
import {Region} from "react-native-maps";
import { deleteCertificate } from '../Services/certificates/service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useCertificates = (currentRegion: Region, currentFilter: FilterValue) => {
    //TODO-> IMPLEMENT FETCH WITH FILTER (WHEN ENDPOINT GETS DONE)
    const [certificates, setCertificates] = useState<ProcessedAddress[]>([]);
    useEffect(() => {
        const adjustedLatitude = currentRegion.latitude - (currentRegion.latitudeDelta * 0.17);
        const minLat: number = adjustedLatitude - currentRegion.latitudeDelta / 2;
        const maxLat: number = adjustedLatitude + currentRegion.latitudeDelta / 2;
        const minLong: number = currentRegion.longitude - currentRegion.longitudeDelta / 2;
        const maxLong: number = currentRegion.longitude + currentRegion.longitudeDelta / 2;
        if (Object.keys(currentFilter).length == 0) {
            fetchCoordinatesWithCertificateInsideRegion(minLat, maxLat, minLong, maxLong)
                .then((resultData) => {
                    if (resultData) setCertificates(resultData);
                });
        }
        else {
            fetchCoordinatesWithCertificateInsideRegionAndFilter(minLat, maxLat, minLong, maxLong, currentFilter)
                .then((resultData) => {
                    if (resultData) setCertificates(resultData);
                });
        }
    }, [currentRegion, currentFilter]);
    return certificates;
};

// Use this if you dont want to have unofficial certificates dangling around the database
// THIS HOOK DOESNT WORK BECAUSE SCREEN SCREEN INDEXES ARE NOT CALLING THE UNMOUNT CALLBACK IN USEEFFECT
const UNHANDLED_KEY = 'unhandled_certificates';
interface UnhandledCertificates {
    ids: Set<number>;
}
let unhandledCertificates: UnhandledCertificates | undefined = undefined;
let hasUnhandledLoaded = false;
let unhandledInstances = 0;
const loadUnhandled = async ()  => {
    const unhandledStr = await AsyncStorage.getItem(UNHANDLED_KEY);
    let unhandled = { ids: new Set<number>() } as UnhandledCertificates;

    if (unhandledStr === null) {
        AsyncStorage.setItem(UNHANDLED_KEY, JSON.stringify([]));  
    } else {
        const ids = JSON.parse(unhandledStr) as number[];
        unhandled = { ids: new Set<number>(ids) }
    }

    const newIds: number[] = [];            
    unhandled.ids.forEach((id) => {
        deleteCertificate(id)
        .then((result) => {
            if (!result)
                newIds.push(id);
        });
    })

    unhandled.ids = new Set<number>(newIds);
    hasUnhandledLoaded = true;
    unhandledCertificates = unhandled;
}
const saveUnhandled = async () => {
    if (unhandledInstances > 0) return;
    if (unhandledCertificates === undefined) return;

    AsyncStorage.setItem(UNHANDLED_KEY, JSON.stringify([...unhandledCertificates.ids]));
}

loadUnhandled();

export const useUnhandledCertificate = () => {
    const [certificate, setCertificate] = useState<Record<string, any> & { certificateId : number } | undefined>(undefined);
    const [isRegistered, setRegistered] = useState<boolean>(false);

    const setToHandle = (newCertificate: Record<string, any>) => {
        if (!isRegistered) {
            unhandledInstances++;
            setRegistered(true);
        }

        if (newCertificate !== undefined && certificate !== undefined) {
            unhandledCertificates?.ids.add(certificate.certificateId);
        }

        if (newCertificate.certificateId !== undefined) {
            setCertificate(newCertificate as Record<string, any> & { certificateId : number });
        }
            
        
    }

    const setHandled = () => {
        setCertificate(undefined);
    }
    
    useEffect(() => {
        // try to delete unhandled
        return () => {
            if (certificate === undefined) return;
            if (!isRegistered) return;

            unhandledCertificates?.ids.add(certificate.certificateId);

            unhandledInstances--;
            saveUnhandled();
        }

    }, []);

    return {
        setToHandle,
        setHandled,
    }
};

export default { useCertificates };