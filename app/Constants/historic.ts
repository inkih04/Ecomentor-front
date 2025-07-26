export type HistoricDatasetType = 'percentRenewable' | 'energyPerformance' | 'qualification' | 'emissions' | 'energySaving';
export type HistoricFilterType = 'town' | 'region' | 'province'

export const percentRenewable = [
    "solarThermal",
    "photovoltaicSolar",
    "biomass",
    "districtNet",
    "geothermal",
]

export const energyPerformance = [
    "nonRenewablePrimaryEnergy",
    "co2Emissions",
    "finalEnergyConsumption",
    "annualCost",
]

export const qualifications = [
    "nonRenewablePrimaryQualification",
    "co2Qualification",
    "heatingQualification",
    "refrigerationQualification",
    "acsQualification",
    "lightingQualification",
]

export const emissions = [
    "heatingEmissions",
    "refrigerationEmissions",
    "acsEmissions",
    "lightingEmissions",
]

export const energySaving = [
    "insulation",
    "windowEfficiency",
]

export default {}