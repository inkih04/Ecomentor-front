import Field from "@/app/Constants/types/field";
import Unit, { IUnit } from "@/app/Constants/types/unit";

const AreaUnit = {...Unit, symbol: 'm^2'} as IUnit;
const EnergyUnit = {...Unit, symbol: 'kWh/m2 · year'} as IUnit;
const CO2Unit =  {...Unit, symbol: 'CO2-kg/m2 · year'} as IUnit;
const EuroUnit = {...Unit, symbol: '€'} as IUnit;
const Degree = {...Unit, symbol: '°'} as IUnit;
const IsolationUnit = {...Unit, symbol: 'W/m2 * K'} as IUnit;



// Used to map fields that its raw value cannot be displayed directly
const CUSTOM_FIELD_TYPE_MAP = new Map<string, Field>([
  ["cadastreMeters", AreaUnit],
  ["nonRenewablePrimaryEnergy", EnergyUnit],
  ["co2Emissions", CO2Unit],
  ["finalEnergyConsumption", EnergyUnit],
  ["annualCost", EuroUnit],
  ["heatingEmissions", CO2Unit],
  ["refrigerationEmissions", CO2Unit],
  ["acsEmissions", CO2Unit],
  ["lightingEmissions", CO2Unit],
  ["latitude", Degree],
  ["longitude", Degree],
  ["residentialUseVentilation", {...Unit, symbol: 'renovations/h'} as IUnit],
  ["insulation", IsolationUnit],
  ["windowEfficiency", IsolationUnit],

]);

const regexFieldMap = new Map<RegExp, Field>([
  [/^nonRenewablePrimary/, EnergyUnit],
  [/^co2/, CO2Unit],
  [/^heating/, CO2Unit],
  [/^refrigeration/, CO2Unit],
  [/^acs/, CO2Unit],
  [/^lighting/, CO2Unit],
]);

export const getMatchingField = (field: string): Field | undefined => {
  for (const regex of regexFieldMap.keys()) {
    if (regex.test(field))
      return regexFieldMap.get(regex);
  }

  return undefined;
}

export default CUSTOM_FIELD_TYPE_MAP;