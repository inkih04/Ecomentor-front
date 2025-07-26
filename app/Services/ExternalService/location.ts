import axios from "axios";
import {LocationResponse} from "@/app/Constants/types";
export const  API_URL = "http://10.0.2.2:8080";
export async function fetchLocationByName(name: string, size: number= 1): Promise<LocationResponse[]> {
    try {
        const response = await axios.get(`${API_URL}/api/geocodificator`, {
            params: {
                cityName: name,
                size: size,
            }
        });
        const resultsData = response.data;
        return resultsData.map((localization: any) => ({
            nom: localization.name,
            coordinates: {
                latitude: localization.latitude,
                longitude: localization.longitude,
            },
        }));
    } catch (error) {
        return [];
    }
}
export default fetchLocationByName;