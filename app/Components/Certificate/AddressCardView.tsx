import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface AddressCardViewProps {
    data: Record<string, string>;
}

export const AddressCardView: React.FC<AddressCardViewProps> = ({ data }) => {
    let address = "";
    if (data.addressName) {
        address = address.concat(data.addressName).concat(data.addressNumber ? ` ${data.addressNumber}` : "");
    }

    if (data.address && data.floor && data.door) {
        address = address.concat(` ${data.floor}${data.door}`);
    }
        
    const displayText = `${address}${address.length > 0 ? ", " : ''}${data.town}`;

    return (<View key={0} style={styles.cardView}>
            <Text>{displayText}</Text>
        </ View>);
}

const styles = StyleSheet.create({
    cardView: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'space-between',
    },
});

export default AddressCardView;