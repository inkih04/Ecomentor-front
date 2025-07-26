import React, { useState } from "react";
import { Text, View, StyleSheet, TextStyle, ViewStyle, Pressable, PressableProps, GestureResponderEvent } from "react-native";

import { Card, ListItem } from "@rneui/themed";

import InfoCardItem, { InfoCardItemStyle } from "./InfoCardItem";


export interface InfoCardProps {
  isAccordionEnabled?: boolean;         // Enables whether the card is a dropdown. By default, this value is true

  style?: InfoCardStyle;

  title: string;                        // The title of the card
  
  icon?: React.JSX.Element;             // Icon displayed next to the title. Should be wrapped around a component, preferably a View
  fields?: {                            // List of fields to be displayed in the card as InfoCardItem. They won't be displayed if customItems are defined
    name: string,                      
    value: string,                     
    customStyle?: InfoCardItemStyle,    // Custom style for an specific InfoCardItem
    symbol?: string,                    // symbol of the value if it has any, declare if you want a custom style. Otherwise, it will inherit
                                        // the value style
  }[];

  valueOnZero?: string,                 // if specified, it will replace the fields value to the corresponding string when they are zero
                                        // only will replace it if the string starts with the value. ex.: "0 m/s"

  pressableProps?: PressableProps       // pressable props to pass to the underlaying Pressable wrapper in InfoCard

  customItems?:                         // List of custom components to be displayed instead of InfoCardItem. Components should be wrapped around a View
    React.JSX.Element | React.JSX.Element[];    
}


export interface InfoCardStyle {
  view?: ViewStyle;                     // main view 
  title?: TextStyle;
  titleContainer?: ViewStyle            // view containing the icon and title or header

  container?: ViewStyle;                // view containing all the InfoCardItems or custom elements
  item?: InfoCardItemStyle;
}

interface ItemProps {
  name: string,                      
  value: string,                     
  customStyle?: InfoCardItemStyle,
  symbol?: string,
  valueOnZero?: string,
}


// Component used to display related fields or components in a digestable form such as: 
// accordion behaviour and automatic formatting of certificate fields

// Allows custom behaviour for being pressed.

const InfoCard: React.FC<InfoCardProps> = (props: InfoCardProps) => {
  const isDropdown = props.isAccordionEnabled ?? true;
  const [isExpanded, setExpanded] = useState(!isDropdown);
  
  const handleOnPress = (event: GestureResponderEvent, onPress: ((event: GestureResponderEvent) => void) | null | undefined) => {
    if (isDropdown){
      setExpanded(prev => !prev);
    }

    if (onPress !== undefined && onPress !== null)
      onPress(event);
  };

  return (
    <View style={[styles.wrapperStyle, props.style?.view]}>
      <Pressable {...props.pressableProps}>
        <ListItem.Accordion containerStyle={StyleSheet.flatten([styles.titleContainer, props.style?.titleContainer])}
            content={
            <ContainerTitle icon={props.icon} title={props.title} titleStyle={StyleSheet.flatten([styles.title, props.style?.title])} />}
            isExpanded={isDropdown ? isExpanded : true}
            noIcon={true}
            {...props.pressableProps}
            onPress={(event) => handleOnPress(event, props.pressableProps?.onPress)}
            >
          <ContainerView style={StyleSheet.flatten([styles.container, props.style?.container])} 
            fields={props.fields}
            customItems={props.customItems}
            itemStyle={props.style?.item} 
            valueOnZero={props.valueOnZero}/>
        </ListItem.Accordion>
      </Pressable>
    </View>

  );
}

const ContainerTitle = ({ icon, title, titleStyle }: 
  { icon: React.JSX.Element | undefined, title: string, titleStyle?: TextStyle }) => {

  return (
    <>
      { icon !== undefined ? React.cloneElement(
        icon as React.JSX.Element, { style: [styles.icon, (icon as React.JSX.Element).props.style] }) : <></>}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </>
  );
}

const ContainerView = ({ style, fields, customItems, itemStyle, valueOnZero }: {style?: ViewStyle, 
  fields?: ItemProps[], customItems?: React.JSX.Element | React.JSX.Element[], itemStyle?: InfoCardItemStyle, valueOnZero?: string}) => {
  let fieldViews: React.JSX.Element | React.JSX.Element[];

  if (customItems !== undefined) {
    fieldViews = customItems;
  } else {
    fieldViews = fields?.map((field) => {
      return (
        <InfoCardItem key={field.name}
          styles={{...itemStyle, ...field.customStyle}}
          fieldName={field.name}
          fieldValue={field.value} 
          symbol={field.symbol}
          valueOnZero={valueOnZero}/>
      );
    }) ?? [];
  }

  return (
    <Card containerStyle={[styles.container, style]}>
      {fieldViews}
    </Card>
  );
}

export default InfoCard;

const styles = StyleSheet.create({
  title: {
    flex: 3,
    fontWeight: '500',
  },

  titleContainer:{
    flex: 1,
    backgroundColor: '#f2f6eb',
    fontWeight: '500',

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    flexDirection: 'row',
  },
  
  wrapperStyle: {
    marginBottom: 30,
  },

  icon: {
    marginLeft: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    borderWidth: 0,
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 50,
    margin: 0,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    backgroundColor: '#f2f6eb',
    elevation: 0, 
    shadowOpacity: 0,
  },
});
