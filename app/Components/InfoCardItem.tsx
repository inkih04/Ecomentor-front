import React from "react";
import { TextStyle, ViewStyle, Text, View, StyleSheet } from "react-native";

export interface InfoCardItemProps {
    fieldName?: string;					// display the name of the field, it will not display it if a custom view is defined
    fieldValue?: string;				// displays a value associated to fieldName, it will not display if a custom view is defined

	styles?: InfoCardItemStyle;
	symbol?: string;					// if a symbol is specified and matches with the symbol in fieldValue, it will style it 
										// with styles.symbol

	valueOnZero?: string;				// if specified, it will replace the value to the corresponding string when it is zero
										// only will replace it if the string starts with the value. ex.: "0 m/s"
}

export interface InfoCardItemStyle {
	view?: ViewStyle;					// style for the main view

	fieldName?: TextStyle;			
	fieldValue?: TextStyle;
	symbol?: TextStyle;
}

// Component used to draw "items" insida an info card.
// Mainly used to display fields with its value in a InfoCard, it could be used outside of that component
export const InfoCardItem: React.FC<InfoCardItemProps> = (props: InfoCardItemProps) => {
    return (
        <View style={[styles.view, props.styles?.view]} key={props.fieldName}>
			<Text style={[styles.name , props.styles?.fieldName]}>{props.fieldName}</Text>
			{handleValueDisplay(props)}
        </View>
    );
}

const handleValueDisplay = function(props: InfoCardItemProps) {
	if (props.valueOnZero !== undefined && isReplacingValueToZero(props.fieldValue))
		return getValueComponent(props, true);

	if (!props.symbol) 
		return getValueComponent(props);
	
	const [has, index] = hasSymbol(props.symbol, props.fieldValue);
	if (has)
		return getValueWithSymbolComponent(props, index);
	else
		return getValueComponent(props);	
}



const getValueComponent = function (props: InfoCardItemProps, isZero = false) {
	return (<Text style={[styles.value , props.styles?.fieldValue]}>{isZero ? props.valueOnZero : props.fieldValue}</Text>);
}

const getValueWithSymbolComponent = function (props: InfoCardItemProps, index: number) {
	return (<View style={styles.valueWithSymbolView}>
		<Text style={[styles.valueWithSymbol, props.styles?.fieldValue]}>{removeSymbolFromValue(props.fieldValue ?? '', index)}</Text>
		<Text style={[styles.symbol, props.styles?.symbol]}>{props.symbol}</Text>
	</View>)
}


const hasSymbol = function (symbol: string | undefined, value: string | undefined): [boolean, number] {
	if (!symbol || !value)
		return [false, -1];
	let index = value.indexOf(symbol);

	return [index != value.length, index];
}

const removeSymbolFromValue = function (value: string, index: number): string  {
	return value.slice(0, index - 1);
}

const isReplacingValueToZero = function (value: string | undefined) {
	if (value === undefined)
		return false;
	
	// eslint-disable-next-line no-useless-escape
	return /^0($|\s+|[\.,]0+(\s*)?)/.test(value);
}



export default InfoCardItem;


const styles = StyleSheet.create({
	view: {
		margin: 2,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	name: {
		flex: 0.5,
		fontWeight: '500',
		textAlign: 'left',
	},

	value: {
		flex: 0.5,
		textAlign: 'right',
		fontWeight: '900',
	},

	valueWithSymbolView: {
		flex:0.5, 
		flexDirection: 'column', 
		justifyContent: "center",
		alignItems: 'baseline',
		flexWrap: 'wrap-reverse',
	},

	valueWithSymbol: {
		fontWeight: '900',
	},

	symbol: {
		fontSize: 12, 
		fontWeight: '200',
	}

});
