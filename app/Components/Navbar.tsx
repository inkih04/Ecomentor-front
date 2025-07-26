import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import { useTranslation } from 'react-i18next';
import AntDesign from '@expo/vector-icons/AntDesign';
import {colors} from "@/app/Constants/colors";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
interface NavbarProps {
    pageTitle: string;
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
    pageTitle, toggleSidebar,
}) => {
    const { t } = useTranslation();

    return (
        //STRUCTURE -> SIDE BAR BUTTON, TITLE OF PAGE, ICON OF APP, SIDEBAR component
        <View style={styles.headerContainer}>
            <StatusBar backgroundColor={colors.forestGreen} barStyle={"light-content"}/>
            <TouchableOpacity onPress={toggleSidebar}>
                <AntDesign name="bars" size={42} color={colors.subtleWhite} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>{t(pageTitle)}</Text>
            <MaterialIcons name="energy-savings-leaf" size={42} color={colors.subtleWhite} />
        </View>
    )
}

//TODO-> animation for the sidebar extending

const styles = StyleSheet.create({
    //TODO -> Implement styles from the mock ups (sizes and colors)
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        backgroundColor: "#568265",
        height: 60,
        paddingHorizontal: 10,
    },

    pageTitle: {
        fontSize: 28,
        color: colors.subtleWhite,
    },

})

export default Navbar;