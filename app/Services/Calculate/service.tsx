import axios from "axios";

import { showToastError } from "@/app/Services/ToastService/toast-service";

export const  API_URL = "http://10.0.2.2:8080";
interface Geolocation {
    longitude: number;
    latitude: number;
}
export const getGeolocation = async function (cityName: string, url?: string): Promise<Geolocation | undefined> {
    const query = `?cityName=${cityName}&size=1`;

    try {
        const response = await axios.get(`${url ?? API_URL}/api/geocodificator${query}`,
            {
                timeout: 5000,
            }
        );

        if (response.status != 200) {
            showToastError("Error getting geolocation", response.statusText);
            return undefined;
        }

        return response.data[0] as Geolocation;
    } catch (error) {
        if (axios.isAxiosError(error))
            showToastError("Error sending request for geolocation");
        else
            showToastError("Error trying to parse data");
        return undefined;
    }
}

export const sendCalculateForm = async function (form: any, url?: string): Promise<object | undefined> {
    const json = JSON.stringify(form);

    try {
        const response = await axios.post(`${url ?? API_URL}/api/certificate/calculateUnofficialCertificate`,
            json,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            }
        );

        if (response.status != 200) {
            showToastError("Error processing certificate form", response.statusText);
            return undefined;
        }

        const result = response.data;

        return result;
    } catch (error) {
        if (axios.isAxiosError(error))
            showToastError("Error sending certificate form", error.response?.data);
        else
            showToastError("Error parsing certificate result");

        return undefined;
    }
}


export const vinculateUnofficialCertificate = async function (userId: number, documentId: number): Promise<boolean> {
    try {
        const response = await axios.post(`${API_URL}/api/users/${userId}/certificates/${documentId}`);

        if (response.status != 200) {
            showToastError("Error trying to vinculate certificate to user", response.data);
            return false;
        }

        return true;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            showToastError("Error trying to vinculate certificate to user");
        }

        return false;
    }
}

export default {};