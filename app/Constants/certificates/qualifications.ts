import { ColorValue } from "react-native";

export type Qualification = 0 | 1 | 2 | 3 | 4 | 5 | 6

export const QualificationFieldSet = new Set<string>([
    "nonRenewablePrimaryQualification",
    "co2Qualification",
    "heatingQualification",
    "refrigerationQualification",
    "acsQualification",
    "lightingQualification",
]);

export const UnoQualificationValueFieldMap = new Map<string, string>([
    ["nonRenewablePrimaryQualification", "ioNonRenewablePrimaryEnergy"],
    ["co2Qualification","ioCO2E"],
    ["heatingQualification","ioHeating"],
    ["refrigerationQualification","ioRefrigeration"],
    ["acsQualification","ioACS"],
    ["lightingQualification","ioLighting"],
]);

export interface Certificate {
    certificateId: number;
}

export const QualificationMap = new Map<Qualification, string>(
    [
        [0, "A"],
        [1, "B"],
        [2, "C"],
        [3, "D"],
        [4, "E"],
        [5, "F"],
        [6, "G"],
    ]
);

export const CertificateColorMap = new Map<string, ColorValue>(
    [
        ["A", "#0cad37"],
        ["B", "#3dae38"],
        ["C", "#abdd0e"],
        ["D", "#f6f706"],
        ["E", "#edce00"],
        ["F", "#ee6c18"],
        ["G", "#ee100f"],
    ]
);

export default {};