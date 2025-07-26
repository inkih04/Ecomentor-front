export interface Coordinate {
    latitude: number;
    longitude: number;
}

interface InfoItem {
    label: string;
    value: string | number;
}

export interface CoordinateWithCertificate {
    coordinates: Coordinate;
    certificateId: string;
    address: string;
}

export interface ProcessedAddress {         //information to create a marker
    latitude: number;
    longitude: number;
    hasMultipleCertificates: boolean;
    certificates: number[];
    addressName: string;
    town: string;
}

export interface CertificateInfo {      //information to load up when clicking on a marker on the map
    id: number;
    address: string;
    shortAddress: string
    //more properties, not decided yet
    emissionsAndEnergy: InfoItem[];
    heatingAndCooling: InfoItem[];
    buildingInfo: InfoItem[];
    sustainabilityFeatures: InfoItem[];
}

export interface LocationResponse {
    nom: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export interface FilterValue {
    [filterName: string]: string | undefined;
}

export interface CertificateDTO {
    certificateId: number;
    documentId: string;
}

export interface Recommendation {
    recommendationId: number,
    name: string,
    description: string,
    type: 'INSULATION' | 'WINDOWS' | 'SOLAR' | 'HEAT_PUMP' | 'BIOMASS' | 'HVAC' | 'LIGHTING' | 'default',
    upgradedICEE: string,
    upgradePercentage: number,
    upgradedAnualCost: number,
    totalPrice: number,
}

export interface RecommendationsResult {
    totalCost: number,
    totalSavings: number,
    totalNewAnnualCost: number,
    totalOldAnnualCost: number,
    "qualificationNew": string,
}

export interface Message {
    text: string;
    isUser: boolean;
    timestamp?: Date | string;
    id?: string;
    suspicious?: boolean;
}

export interface BanStatus {
    banned: boolean;
    banEndTime: string;
}
