import axios, { isAxiosError } from 'axios';

import { HistoricDatasetType, HistoricFilterType, } from '@/app/Constants/historic';
import { OneOf } from '@/app/Utils/type';

import { showToastError } from "@/app/Services/ToastService/toast-service";

import { parseQualifications } from './parser';
import { fetchProfile } from '../UserService/user-service';

export const  API_URL = "http://10.0.2.2:8080";
export const fetchCertificateData = async function (id: number, url?: string): Promise<object | undefined> {

    try {
        const response = await axios.get(`${url ?? API_URL}/api/certificate/${id}`,
            {
                timeout: 5000,
            }
        );

        if (response.status != 200) {
            showToastError("Error fetching certificate", response.statusText);
            return undefined;
        }

        
        return response.data;
    } catch (error) {
        showToastError("Error fetching certificate", "An error was found");
        return undefined;
    }
}

export const vinculateOfficialCertificate = async function (userId: number, documentId: number) {
    try {
        const response = await axios.post(`${API_URL}/api/users/${userId}/official-certificates/${documentId}`,
            {
                timeout: 5000,
            }
        );

        if (response.status != 200) {
            showToastError("Certificate not found", "The certificate was not found");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            showToastError("Certificate not found", "The certificate was not found");
        }
        
    }
}

export const fetchAllUserCertificates = async function (url?: string): Promise<object[] | undefined> {
    try {
        const user = await fetchProfile();
        const response = await axios.get(`${url ?? API_URL}/api/users/${user.id}/certificates`);
        
        if (response.status != 200) {
            showToastError("Error trying to get all user certificates");
            return undefined;
        }

        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            showToastError("Error trying to get all user certificates");
        }
        
        return undefined;
    }
}

export const deleteCertificate = async function (id: number, url?: string): Promise<boolean> {
    try {
        const response = await axios.delete(`${url ?? API_URL}/api/certificate/${id}`);

        if (response.status != 204) {
            showToastError("Error trying to delete unofficial certificate", response.statusText);
            return false;
        }
        
        return true;
    } catch (error) {
        if (axios.isAxiosError(error))
            showToastError("Error trying to delete unofficial certificate");

        return false;
    }
}

export type LocationFilter = {
    locationType: HistoricFilterType;
    locationOption: string;
} | {
    locationType: HistoricFilterType;
    locationOption?: string;
} | {
    locationType?: HistoricFilterType;
    locationOption?: string;
};

export type GroupByType = 'none' | 'buildingType';

export type HistoricDataProps = {
    type: HistoricDatasetType,
    groupBy: GroupByType,
} & LocationFilter;

const historicDataEndpoints = new Map<HistoricDatasetType, string>([
    ['percentRenewable', '/api/address/graphValuesRenewable'],
    ['energyPerformance', '/api/address/graphValuesPerformance'],
    ['qualification', '/api/address/graphValuesQualification'],
    ['emissions', '/api/address/graphValuesEmissions'],
    ['energySaving', '/api/address/graphValuesEnergy'],
])

export const fetchHistoricData = async function (props: HistoricDataProps, url?: string): Promise<object[] | undefined> {
    let endpoint = `${url ?? API_URL}${historicDataEndpoints.get(props.type) as string}`;

    if (props.locationType) {
        endpoint = endpoint.concat(`?${props.locationType}=${props.locationOption}`);        
    }

    try {
        const response = await axios.get(endpoint, 
            {
                headers: {
                    'accept': '*/*',
                },
            }
        );

        if (response.status != 200) {            
            showToastError("Error fetching historic data", response.statusText);
            return undefined;
        }

        if (props.type === 'qualification')
            parseQualifications(response.data);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error))
            showToastError("Error fetching historic data", error.response?.data);

        return undefined;
    }
}

const historicOptionsEndpoints = new Map<HistoricFilterType, string>([
    ['town', "/api/address/distinct/towns"],
    ['region', "/api/address/distinct/regions"],
    ['province', "/api/address/distinct/provinces"],
])

export const fetchHistoricDataOptions = async function(url?: string): Promise<Record<HistoricFilterType, string[]> | undefined> {
    const output: Record<HistoricFilterType, string[]> = { town: [], region: [], province: []};
    const responses = await Promise.all(
        Array.from(historicOptionsEndpoints.entries()).map(async ([filterType, endpoint]) => {
            try {
                const response = await axios.get(`${url ?? API_URL}${endpoint}`, {
                    headers: { 'accept': '*/*' },
                });

                if (response.status !== 200) {
                    showToastError("Error trying to obtain options", response.statusText);
                    return { type: filterType, data: [] };
                }

                return { type: filterType, data: response.data[`${filterType}s`] };
            } catch (err) {
                showToastError("Error trying to obtain options", "An error occurred");
                return { type: filterType, data: [] }; 
            }
        })
    );
    
    for (const result of responses) {
        output[result.type] = result.data;
    }

    return output;
}

export default {};