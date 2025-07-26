import { useEffect, useMemo, useState } from "react";
import { OneOf } from "../Utils/type";
import * as Location from "expo-location";
import { fetchAllUserCertificates } from "../Services/certificates/service";
import { showToastError } from "../Services/ToastService/toast-service";
import fetchAgendadosEvents, { EventFetchProps } from "../Services/AgendadosService/service";
import { CalendarEvent } from "../Constants/calendar";


export type UseEventProps = OneOf<{
    certificateId: number;
    userLocation: boolean;
    barcelona: boolean;
}>;

export type EventFetchType = 'barcelona' | 'location' | 'certificate';

// Approximate radius in degrees for a city-sized area (~10-15km)
// 0.1 degree latitude ≈ 11km; adjust as needed for your city size
const CERTIFICATE_RADIUS = 0.05;
const USERLOCATION_RADIUS = 0.05;
const BARCELONA_FETCH_PROPS: EventFetchProps = {
    latMax: 41.4689,  // Northernmost point
    latMin: 41.3200,  // Southernmost point
    lonMax: 2.2286,   // Easternmost point
    lonMin: 2.0695,   // Westernmost point
};

export const useEvent = function (fetchType?: UseEventProps) {
    const [certificates, setCertificates] = useState<Record<string, any>[] | undefined>(undefined);
    const [location, setLocation] = useState<Location.LocationObject | undefined>(undefined);
    const [events, setEvents] = useState<CalendarEvent[] | undefined>(undefined);
    const [currentType, setCurrentType] = useState<EventFetchType>('barcelona');

    const [isLoading, setLoading] = useState(false);

    const certificateMap = useMemo(() => {
        const certificateEntries = certificates !== undefined
            ? certificates.map((certificate): [number, Record<string, any>] => [
                certificate.certificateId as number, certificate
            ])
            : undefined;

        if (certificateEntries === undefined) return undefined;

        return new Map<number, Record<string, any>>(certificateEntries);
    }, [certificates]);


    useEffect(function fetchDependencyData() {
        fetchAllUserCertificates()
            .then((data) => {
                if (data === undefined) return;

                setCertificates(data);
            });

        (async function fetchCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                showToastError("Permission to access location was denied");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        })();

    }, []);

    useEffect(function fetchEvents() {
        // By default it's the center of barcelona
        let fetchProps = BARCELONA_FETCH_PROPS;

        if (fetchType?.certificateId && certificateMap !== undefined) {
            const latitude = certificateMap.get(fetchType.certificateId)?.addressDTO.latitude as number;
            const longitude = certificateMap.get(fetchType.certificateId)?.addressDTO.longitude as number;
            fetchProps = getFetchProps(CERTIFICATE_RADIUS, latitude, longitude);
        }

        if (fetchType?.userLocation && location !== undefined) {
            fetchProps = getFetchProps(USERLOCATION_RADIUS, location.coords.latitude, location.coords.longitude);
        }

        setLoading(true);
        fetchAgendadosEvents(fetchProps)
            .then((data) => {
                if (data === undefined) return;

                setCurrentType(fetchType?.certificateId !== undefined ? 'certificate' : fetchType?.userLocation ? 'location' : 'barcelona');
                setEvents(data);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [fetchType]);

    return {
        userCertificates: certificates,
        coords: location?.coords,
        events,
        isLoading,
        eventsFetchType: currentType,

        getCertificate: (id: number) => certificateMap?.get(id),
    }
}

const getFetchProps = function (radius: number, latitude: number, longitude: number): EventFetchProps {
    return {
        latMax: latitude + radius,
        latMin: latitude - radius,
        lonMax: longitude + radius,
        lonMin: longitude - radius,
    };
}

export default useEvent;