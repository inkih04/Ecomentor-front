import {CertificateInfo, ProcessedAddress, FilterValue} from "@/app/Constants/types";
import axios from 'axios';
export const  API_URL = "http://10.0.2.2:8080";
export const fetchCoordinatesWithCertificateInsideRegion = async (minLat: number, maxLat: number, minLong: number, maxLong: number) => {
    try {
        const result = await axios.get(`${API_URL}/api/address/BoundingBox`, {
            params: {
                minLatitude: minLat,
                maxLatitude: maxLat,
                minLongitude: minLong,
                maxLongitude: maxLong,
            }
        });
        const resultData = result.data;
        return resultData.map((item: ProcessedAddress) => ({
            latitude: item.latitude,
            longitude: item.longitude,
            hasMultipleCertificates: item.certificates.length > 1,
            certificates: item.certificates,
            addressName: item.addressName,
            town: item.town,
        }));
    } catch(error) {
        return [];
    }
}

export const fetchCoordinatesWithCertificateInsideRegionAndFilter = async (minLat: number, maxLat: number, minLong: number, maxLong: number, filter: FilterValue) => {
    const requestBody = JSON.stringify({
        filters: {
            ...filter,
        },
        minLatitude: minLat,
        maxLatitude: maxLat,
        minLongitude: minLong,
        maxLongitude: maxLong,
    });
    
    try {
        const result = await axios.post(`${API_URL}/api/address/multiplefilters`,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const resultData = result.data;
        return resultData.map((item: ProcessedAddress) => ({
            latitude: item.latitude,
            longitude: item.longitude,
            hasMultipleCertificates: item.certificates.length > 1,
            certificates: item.certificates,
            addressName: item.addressName,
            town: item.town,
        }));
    } catch(error) {
        return [];
    }
}

export const fetchCertificateByID = async (certificateId: number): Promise<CertificateInfo | undefined> => {
    try {
        const result = await axios.get(`${API_URL}/api/certificate/${certificateId}`);
        const resultData = result.data;

        const getValue = (value: any) => value !== null && value !== undefined ? value : "No Data";

        return {
            id: resultData.certificateId,
            address: `${resultData.addressDTO.town}, ${resultData.addressDTO.addressName} ${getValue(resultData.door)}`,
            shortAddress: `${resultData.addressDTO.addressName}`,
            emissionsAndEnergy: [
                { label: 'CO₂ Qualification', value: getValue(resultData.co2Qualification) },
                { label: 'CO₂ Emissions (kg CO2/m2·year)', value: getValue(resultData.co2Emissions) },
                { label: 'Primary Energy Qualification', value: getValue(resultData.nonRenewablePrimaryQualification) },
                { label: 'Primary Energy Consumption (kWh/m²·year)', value: getValue(resultData.nonRenewablePrimaryEnergy) }
            ],

            heatingAndCooling: [
                { label: 'Heating Qualification', value: getValue(resultData.heatingQualification) },
                { label: 'Heating Emissions (kg CO2/m2·year)', value: getValue(resultData.heatingEmissions) },
                { label: 'Refrigeration Qualification', value: getValue(resultData.refrigerationQualification) },
                { label: 'Refrigeration Emissions (kg CO2/m2·year)', value: getValue(resultData.refrigerationEmissions) }
            ],
            buildingInfo: [
                { label: 'Area (m²)', value: getValue(resultData.cadastreMeters) },
                { label: 'Building Year', value: getValue(resultData.buildingYear) },
                { label: 'Floor', value: getValue(resultData.floor) },
                { label: 'Door', value: getValue(resultData.door) }
            ],
            sustainabilityFeatures: [
                { label: 'Has Solar Panels?', value: resultData.photovoltaicSolar ? "Yes" : "No" },
                { label: 'Has Biomass Energy?', value: resultData.biomass ? "Yes" : "No" },
                { label: 'Has District Heating?', value: resultData.districtNet ? "Yes" : "No" },
                { label: 'Window Efficiency', value: getValue(resultData.windowEfficiency) }
            ]
        };
    } catch (error) {
        return undefined;
    }
};

export default {fetchCoordinatesWithCertificateInsideRegion, fetchCertificateByID};