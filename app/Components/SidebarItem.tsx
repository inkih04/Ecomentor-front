import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/FontAwesome5';
import {colors} from "@/app/Constants/colors";
import {useTranslation} from "react-i18next";

interface SidebarItemProps {
    pageKey: string;
    icon: keyof typeof AntDesign.glyphMap; //used to get icon based on its name
    onClose: () => void;
    isCurrentPage: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ pageKey, icon, onClose, isCurrentPage }) => {
    const router = useRouter();
    const { t } = useTranslation();
    const handlePress = () => {
        // @ts-expect-error gives error because not all routes are defined yet (or thats what i think)
        router.push(`/Screens/${pageKey.toLowerCase()}`);
        onClose(); //closes sidebar using prop function
    };


    const displayText = t(pageKey);

    return (
        <TouchableOpacity style={[styles.sidebarItemContainer, isCurrentPage && styles.currentPage]} onPress={handlePress}>
            <AntDesign name={icon} size={28} color= {colors.subtleWhite} />
            <Text style={styles.text}>{displayText}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sidebarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    currentPage: {
        backgroundColor: colors.forestGreen,
        borderRadius: 32,
    },
    text: {
        fontSize: 24,
        color: "#FFFFFF",
        marginLeft: 10,
    },
});

export default SidebarItem;
