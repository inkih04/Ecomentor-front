import axios from 'axios';
import "@/i18n";
import {Recommendation, RecommendationsResult} from "@/app/Constants/types";
export const  API_URL = "http://10.0.2.2:8080";


export async function getRecommendationsForCertificate(certificateId: number | undefined) {
    try {
        const response = await axios.post(`${API_URL}/api/recommendation/generate/${certificateId}`);
        return response.data;
    }
        catch (error) {
        throw error;
    }
}

export const fetchFinalRecommendationValues = async (certificateId: number | undefined, recommendationDTOs: Recommendation[]): Promise<RecommendationsResult> => {
    if (certificateId === undefined) {
        throw new Error("Certificate ID is required to fetch final recommendation values.");
    }

    try {
        const response = await axios.post<RecommendationsResult>(
            `${API_URL}/api/recommendation/finalValues/${certificateId}`,
            recommendationDTOs
        );
        return response.data;
    }
    catch (error) {
        throw error;
    }
};