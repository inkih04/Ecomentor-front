import React from "react";
import {StyleSheet, View, Text} from "react-native";
import AntDesign from '@expo/vector-icons/FontAwesome5';
import { colors } from '../Constants/colors'
interface InfoItem {
    label: string;
    value: string | number;
}

interface InfoCardProps {
    icon: string;
    title: string;
    data: InfoItem[];
    style?: object;
}

const BottomSheetCard: React.FC<InfoCardProps> = ({ icon, title, data }) => {

    return (
        <View style={styles.container}>
            <View style={styles.cardHeader}>
                <AntDesign name={icon} size={20} style={styles.icon} />
                <Text style={styles.title}>{title}</Text>
            </View>
            <View>
                {data.map((item, index) => (
                    <View key={index} style={styles.item}>
                        <Text style={styles.label}>{item.label}:</Text>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>
                ))}
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.subtleWhite,
        width: '100%',
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    label: {
        fontWeight: "400",
    },
    value: {
        color: colors.darkGreen,
        fontWeight: "600",
    },
    icon: {
        marginRight: 8,
    },
})

export default BottomSheetCard;