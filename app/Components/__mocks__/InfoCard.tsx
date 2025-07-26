import React from 'react';
import { View, Text } from 'react-native';


interface InfoCardProps {
  title: string,
  fields: {
    name: string,
    value: string,
  }[],
  icon?: React.JSX.Element,
  customItems?: React.JSX.Element[],
  isAccordionEnabled?: boolean,
}
const InfoCard = ( props: InfoCardProps ) => {
  return(
  <View testID="mock-infocard">
    <Text>{props.title}</Text>
    {props.icon !== undefined ? <Text>IconInfoCard</Text> : <></>}
    {!props.customItems &&
      props.fields.map((field, index) => (
        <View key={index} testID={`mock-field-${index}`}>
          <Text>{field.name}</Text>: <Text>{field.value}</Text>
        </View>
      ))}
    {props.customItems && 
      <View testID="mock-custom-items">{props.customItems}</View>}
  </View>
);
}

export default InfoCard;