import React from "react";
import { ScrollView, StyleSheet, TextStyle, View, ViewStyle, Text } from "react-native";

import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import InfoCard from "@/app/Components/InfoCard";
import CUSTOM_FIELD_TYPE_MAP from "@/app/Constants/certificates/units";
import { IUnit } from "@/app/Constants/types/unit";


interface ScreenTopology {
  cards: {                          // List of datasets for InfoCard
    type: string,                   // Title of InfoCard
    icon: React.JSX.Element         // Icon of InfoCard
    isDropdown?: boolean,           // Whether InfoCard is a dropdown
    fields: string[],               // List of fields to display inside InfoCard
  } [],
}

const ICON_PROPS = {
  flex: 1,
} as TextStyle


const screenTopology: ScreenTopology = {
  cards: [
    {
      type: "General",
      icon: <FontAwesome name="certificate" size={24} color="black" style = {ICON_PROPS} />,
      fields: [
        "documentId", "certificateType", "entryDate", "adressName", "buildingUse", "energeticRehabilitation", 
      ],
      isDropdown: false,
    },
    {
      type: "Location",
      icon: <MaterialCommunityIcons name="office-building-marker" size={24} color="black" style = {ICON_PROPS} />,
      fields: [
        "adressName", "addressNumber", "zipcode", "town", "region", "province", "latitude", "longitude", "floor", "door",
        "climateZone", "cadastreMeters", "buildingYear",
      ],
    },
    {
      type: "Footprint",
      icon: <MaterialCommunityIcons name="smoke" size={24} color="black" style = {ICON_PROPS} />,
      fields: [
        "nonRenewablePrimaryQualification", "nonRenewablePrimaryEnergy", "co2Emissions", "finalEnergyConsumption",
        "annualCost", 
      ],
    },
    {
      type: "Performance",
      icon: <FontAwesome name="gears" size={24} color="black" style = {ICON_PROPS} />,
      fields: [
        "heatingQualification", "heatingEmissions", "refrigerationQualification", "refrigerationEmissions",
        "acsQualification", "acsEmissions", "lightingQualification", "lightingEmissions", "residentialUseVentilation",
      ],
    },
    {
      type: "Sustainability",
      icon: <MaterialIcons name="eco" size={24} color="black" style = {ICON_PROPS} />,
      fields: [
        "electricVehicle", "solarThermal", "photovoltaicSolar", "biomass", "districtNet", "geothermal",
      ],
    },
    {
      type: "Building efficiency",
      icon: <MaterialCommunityIcons name="office-building-cog" size={24} color="black" style = {ICON_PROPS} />,
      fields: [
        "insulation", "windowEfficiency", 
      ],
    },
    
  ]
}

const DEFAULT_ZERO_NULL_VALUE = "NULL";

const CertificateDetails = function () {
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const parsedData = params.data !== undefined ? JSON.parse(params.data as string) as Record<string, string> : undefined;
  
  const dataMap = parsedData !== undefined ? new Map<string, string>(Object.entries(parsedData).map(([name, value]) => [name, value])) : undefined;

  const handleFields = (fieldNames: string[]) => {
    if (dataMap === undefined) return [];

    return fieldNames.map((fieldName) => {
      return { 
        name: t(fieldName), 
        value: dataMap.get(fieldName) || DEFAULT_ZERO_NULL_VALUE, 
        symbol: (CUSTOM_FIELD_TYPE_MAP.get(fieldName) as IUnit)?.symbol ?? undefined };
    });
  }

  if (dataMap === undefined) {
    return (<View><Text>Error trying to display certificate</Text></View>)
  } else {
    return (
      <ScrollView style={styles.scrollView}>
        {
          screenTopology.cards.map((cardInfo) => {
            return (<InfoCard
              key={cardInfo.type}
              isAccordionEnabled={cardInfo.isDropdown}
              title={cardInfo.type}
              icon={cardInfo.icon}
              fields={handleFields(cardInfo.fields) as unknown as {name: string, value: string, symbol: string}[]}
              valueOnZero={DEFAULT_ZERO_NULL_VALUE}
              />);
          })
        }
      </ScrollView>
    );
  }
};

export default CertificateDetails;

const styles = StyleSheet.create({
  scrollView: {
    padding: 30,
    paddingBottom: 60,
    gap: 30,
    backgroundColor: 'white',
  } as ViewStyle,
});
