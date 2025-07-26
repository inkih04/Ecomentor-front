import { CertificateInfo } from "@/app/Constants/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { getInfoItemValue, getBooleanValue } from "@/app/Utils/commonUtils";

export const buildComparisonData = (certificate1: CertificateInfo, certificate2: CertificateInfo) => {
    const co2Qual1 = getInfoItemValue(certificate1.emissionsAndEnergy, "CO₂ Qualification");
    const co2Emiss1 = getInfoItemValue(certificate1.emissionsAndEnergy, "CO₂ Emissions (kg CO2/m2·year)");
    const co2Qual2 = getInfoItemValue(certificate2.emissionsAndEnergy, "CO₂ Qualification");
    const co2Emiss2 = getInfoItemValue(certificate2.emissionsAndEnergy, "CO₂ Emissions (kg CO2/m2·year)");

    const hasSolarPanels1 = getBooleanValue(getInfoItemValue(certificate1.sustainabilityFeatures, "Has Solar Panels?"));
    const hasBiomassEnergy1 = getBooleanValue(getInfoItemValue(certificate1.sustainabilityFeatures, "Has Biomass Energy?"));
    const hasDistrictHeating1 = getBooleanValue(getInfoItemValue(certificate1.sustainabilityFeatures, "Has District Heating?"));

    const hasSolarPanels2 = getBooleanValue(getInfoItemValue(certificate2.sustainabilityFeatures, "Has Solar Panels?"));
    const hasBiomassEnergy2 = getBooleanValue(getInfoItemValue(certificate2.sustainabilityFeatures, "Has Biomass Energy?"));
    const hasDistrictHeating2 = getBooleanValue(getInfoItemValue(certificate2.sustainabilityFeatures, "Has District Heating?"));

    const primEnergyQual1 = getInfoItemValue(certificate1.emissionsAndEnergy, "Primary Energy Qualification");
    const primEnergyQual2 = getInfoItemValue(certificate2.emissionsAndEnergy, "Primary Energy Qualification");
    const heatQual1 = getInfoItemValue(certificate1.heatingAndCooling, "Heating Qualification");
    const heatQual2 = getInfoItemValue(certificate2.heatingAndCooling, "Heating Qualification");

    const betterPrimEnergy1 = primEnergyQual1.charCodeAt(0) < primEnergyQual2.charCodeAt(0);
    const betterPrimEnergy2 = primEnergyQual2.charCodeAt(0) < primEnergyQual1.charCodeAt(0);
    const betterHeat1 = heatQual1.charCodeAt(0) < heatQual2.charCodeAt(0);
    const betterHeat2 = heatQual2.charCodeAt(0) < heatQual1.charCodeAt(0);

    const features = {
        solarEnergy: {
            title: "SOLAR ENERGY?",
            cert1Value: hasSolarPanels1,
            cert2Value: hasSolarPanels2,
            icon: <MaterialCommunityIcons name="solar-power" size={28} color="black" />
        },
        biomassEnergy: {
            title: "BIOMASS ENERGY?",
            cert1Value: hasBiomassEnergy1,
            cert2Value: hasBiomassEnergy2,
            icon: <MaterialCommunityIcons name="leaf" size={28} color="black" />
        },
        districtHeating: {
            title: "DISTRICT HEATING?",
            cert1Value: hasDistrictHeating1,
            cert2Value: hasDistrictHeating2,
            icon: <MaterialCommunityIcons name="radiator" size={28} color="black" />
        },
        betterEnergyQualification: {
            title: "BETTER ENERGY",
            cert1Value: betterPrimEnergy1,
            cert2Value: betterPrimEnergy2,
            icon: <MaterialCommunityIcons name="flash" size={28} color="black" />
        },
        betterRefrigeration: {
            title: "BETTER HEATING",
            cert1Value: betterHeat1,
            cert2Value: betterHeat2,
            icon: <MaterialCommunityIcons name="flash" size={28} color="black" />
        },
    };

    return {
        co2Qual1,
        co2Emiss1,
        co2Qual2,
        co2Emiss2,
        features
    };
};

export const buildEmissionsComparisonData = (certificate1: CertificateInfo, certificate2: CertificateInfo) => {
    const heatingEmissions1 = getInfoItemValue(certificate1.heatingAndCooling, "Heating Emissions (kg CO2/m2·year)");
    const heatingEmissions2 = getInfoItemValue(certificate2.heatingAndCooling, "Heating Emissions (kg CO2/m2·year)");

    const refrigerationEmissions1 = getInfoItemValue(certificate1.heatingAndCooling, "Refrigeration Emissions (kg CO2/m2·year)");
    const refrigerationEmissions2 = getInfoItemValue(certificate2.heatingAndCooling, "Refrigeration Emissions (kg CO2/m2·year)");

    const primaryEnergyConsumption1 = getInfoItemValue(certificate1.emissionsAndEnergy, "Primary Energy Consumption (kWh/m²·year)");
    const primaryEnergyConsumption2 = getInfoItemValue(certificate2.emissionsAndEnergy, "Primary Energy Consumption (kWh/m²·year)");

    const buildingArea1 = getInfoItemValue(certificate1.buildingInfo, "Area (m²)");
    const buildingArea2 = getInfoItemValue(certificate2.buildingInfo, "Area (m²)");

    return {
        heatingEmissions1,
        heatingEmissions2,
        refrigerationEmissions1,
        refrigerationEmissions2,
        primaryEnergyConsumption1,
        primaryEnergyConsumption2,
        buildingArea1,
        buildingArea2
    };
};
