import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useLocationPermission = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    return hasPermission;
};

export default {useLocationPermission};