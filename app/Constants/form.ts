import * as yup from 'yup';

import { FieldPaths, OneOf } from '@/app/Utils/type';
import { ViewStyle } from 'react-native';


export const heatingSystems = [
    "boiler",
]

export const coolingSystems = [
    "airConditioning",
]

export const buildingTypes = [
    "terciari",
    "blocHabitatgesPlurifamiliar",
    "habitatgeIndividualBlocHabitatges",
    "habitatgeUnifamiliar",
]
export const buildingTypeValues = [
    "Terciari",
    "Bloc d'habitatges plurifamiliar",
    "Habitatge individual en bloc d'habitatges",
    "Habitatge unifamiliar",
]

const climateZoneTypes = [
    'A1', 'A2', 'A3', 'A4',
    'B1', 'B2', 'B3', 'B4',
    'C1', 'C2', 'C3', 'C4',
    'D1', 'D2', 'D3', 'D4',
    'E1', 'E2', 'E3', 'E4',
];

const heatingSystemTypes = [
    'electricBoiler',
    'geothermal',
    'districtNet',
    'biomass',
    'gasBoiler',
];

const heatingSystemValues = ["ELECTRICA", "GEOTERMIA", "DISTRICTE", "BIOMASSA", "GAS"];

const refrigerationSystemTypes = [
    'electric',
    'districtNet',
    'geothermal',
];

const refrigerationSystemValues = ["ELECTRICA", "DISTRICTE", "GEOTERMIA"];

export const usageIndicators = [
    "closeToZero",
]

const levels = [
    'none',
    'veryLow',
    'low',
    'medium',
    'high',
    'veryHigh',
    'maximum',
]
const levelValues = levels.map((value, index) => index);

export type InputType = 'picker' | 'numberInput' | 'booleanOption' | 'yearInput' | 'textInput' | 'none' | undefined;

export type FieldTypeProps = OneOf<{
    picker?: {
        data: string[];     // List of options to be display in the picker
        values?: number[] | string[];  // Optional, list of values that each option map to
    };
    numberInput?: {
        units: string;      // Optional units to display next to the numberInput.
    };
    textInput?: {
        pattern?: RegExp    // Optional, regex that the input has to match to be valid
        onMountValue?: string
        // Optional, sets the value
    };
}>;

export type CalculateFormField<FormShape extends object> = {
    fieldKey: FieldPaths<FormShape>;
    labelTag?: string;
    customType?: InputType;
} & FieldTypeProps;

export type CalculateFormPage<FormShape extends object> = {
    fields: CalculateFormField<FormShape>[];
    style?: {
        pageContainer?: ViewStyle;
    }
};

export interface CalculateForm<FormShape extends object> {
    pages: CalculateFormPage<FormShape>[];

    styles?: {
        container?: ViewStyle;
        pageContainer?: ViewStyle;
    }
}

export interface AddressDTO {
    addressName: string;
    addressNumber: string;
    zipcode: number;
    town: string;
    region: string;
    province: string;
    longitude: number;
    latitude: number;
    certificates: (number | undefined)[];
}
export interface CalculateFormShape {
    createAddressDTO: AddressDTO;
    floor?: string;
    door?: string;
    cadastreMeters: number;
    climateZone: string;
    buildingYear?: Date;
    buildingUse: string;

    electricVehicle: boolean;
    solarThermal: boolean;
    photovoltaicSolar: boolean;

    kindOfHeating: string;
    kindOfRefrigeration: string;
    kindOfAcs: string;

    annualCost?: number;
    insulation: number;
    windowEfficiency: number;

    residentialUseVentilation: number;
    energeticRehabilitation: boolean;

    heatingConsumption: number;
    refrigerationConsumption: number;
    acsConsumption: number;
    lightingConsumption: number;

}

const APPROX_SCHEMA = yup.number().oneOf(levelValues).default(3);
export const CalculateFormSchema: yup.ObjectSchema<CalculateFormShape> = yup.object().shape({
    createAddressDTO: yup.object().required().shape({
        addressName: yup.string().required(),
        addressNumber: yup.string().required(),
        zipcode: yup.number().required(),
        town: yup.string().required(),
        region: yup.string().required(),
        province: yup.string().required(),
        longitude: yup.number().required(),
        latitude: yup.number().required(),
        certificates: yup.array().of(yup.number()).default(() => [0]),
    }),
    floor: yup.string(),
    door: yup.string(),
    cadastreMeters: yup.number().min(0).required(),
    climateZone: yup.string().oneOf(climateZoneTypes).required(),
    buildingYear: yup.date(),
    buildingUse: yup.string().oneOf(buildingTypeValues).required(),

    electricVehicle: yup.boolean().default(false),
    solarThermal: yup.boolean().required(),
    photovoltaicSolar: yup.boolean().required(),

    kindOfHeating: yup.string().oneOf(heatingSystemValues).required(),
    kindOfRefrigeration: yup.string().oneOf(refrigerationSystemValues).required(),
    kindOfAcs: yup.string().oneOf(heatingSystemValues).required(),

    annualCost: yup.number().min(0),
    insulation: APPROX_SCHEMA,
    windowEfficiency: APPROX_SCHEMA,

    residentialUseVentilation: APPROX_SCHEMA,
    energeticRehabilitation: yup.boolean().required(),

    heatingConsumption: yup.number().min(0).required(),
    refrigerationConsumption: yup.number().min(0).required(),
    acsConsumption: yup.number().min(0).required(),
    lightingConsumption: yup.number().min(0).required(),
});

export const CalculateFormViewSchema: CalculateForm<CalculateFormShape> = {
    pages: [
        {
            fields: [
                {
                    fieldKey: 'createAddressDTO.addressName',
                    labelTag: 'adressName',
                },
                {
                    fieldKey: 'createAddressDTO.addressNumber',
                    labelTag: 'addressNumber',
                },
                {
                    fieldKey: 'createAddressDTO.zipcode',
                    labelTag: 'zipcode',
                },
                {
                    fieldKey: 'createAddressDTO.town',
                    labelTag: 'town',
                },
                {
                    fieldKey: 'createAddressDTO.region',
                    labelTag: 'region',
                },
                {
                    fieldKey: 'createAddressDTO.province',
                    labelTag: 'province',
                },
                {
                    fieldKey: 'floor',
                    labelTag: 'floor',
                },
                {
                    fieldKey: 'door',
                    labelTag: 'door',
                },
            ]
        },
        {
            fields: [
                {
                    fieldKey: 'cadastreMeters',
                    labelTag: 'cadastreMeters',
                    numberInput: {
                        units: 'm2',
                    },
                },
                {
                    fieldKey: 'climateZone',
                    labelTag: 'climateZone',
                    picker: {
                        data: climateZoneTypes,
                        values: climateZoneTypes,
                    }
                },
                {
                    fieldKey: 'buildingYear',
                    labelTag: 'buildingYear',
                    customType: 'yearInput',
                },
                {
                    fieldKey: 'buildingUse',
                    labelTag: 'buildingUse',
                    picker: {
                        data: buildingTypes,
                        values: buildingTypeValues,
                    },
                },
            ]
        },
        {
            fields: [
                {
                    fieldKey: 'electricVehicle',
                    labelTag: 'electricVehicle'
                },
                {
                    fieldKey: 'solarThermal',
                    labelTag: 'solarThermal'
                },
                {
                    fieldKey: 'photovoltaicSolar',
                    labelTag: 'photovoltaicSolar'
                },
                {
                    fieldKey: 'kindOfHeating',
                    labelTag: 'kindOfHeating',
                    picker: {
                        data: heatingSystemTypes,
                        values: heatingSystemValues,
                    },
                },
                {
                    fieldKey: 'kindOfRefrigeration',
                    labelTag: 'kindOfRefrigeration',
                    picker: {
                        data: refrigerationSystemTypes,
                        values: refrigerationSystemValues,
                    },
                },
                {
                    fieldKey: 'kindOfAcs',
                    labelTag: 'kindOfAcs',
                    picker: {
                        data: heatingSystemTypes,
                        values: heatingSystemValues,
                    },
                },

            ]
        },
        {
            fields: [
                {
                    fieldKey: 'annualCost',
                    labelTag: 'annualCost',
                    numberInput: { units: '€' },
                },
                {
                    fieldKey: 'insulation',
                    labelTag: 'insulation',
                    picker: { data: levels, values: levelValues },
                },
                {
                    fieldKey: 'windowEfficiency',
                    labelTag: 'windowEfficiency',
                    picker: { data: levels, values: levelValues },
                },
                {
                    fieldKey: 'residentialUseVentilation',
                    labelTag: 'residentialUseVentilation',
                    picker: { data: levels, values: levelValues },
                },
                {
                    fieldKey: 'energeticRehabilitation',
                    labelTag: 'energeticRehabilitation',
                },
            ]
        },
        {
            fields: [
                {
                    fieldKey: 'heatingConsumption',
                    labelTag: 'heatingConsumption',
                    numberInput: {
                        units: 'kWh',
                    },
                },
                {
                    fieldKey: 'refrigerationConsumption',
                    labelTag: 'refrigerationConsumption',
                    numberInput: {
                        units: 'kWh',
                    },
                },
                {
                    fieldKey: 'acsConsumption',
                    labelTag: 'acsConsumption',
                    numberInput: {
                        units: 'kWh',
                    },
                },
                {
                    fieldKey: 'lightingConsumption',
                    labelTag: 'lightingConsumption',
                    numberInput: {
                        units: 'kWh',
                    },
                },
            ]
        },
    ],
}