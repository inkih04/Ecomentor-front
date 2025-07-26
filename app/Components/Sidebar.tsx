import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {colors} from "@/app/Constants/colors";
import {pages} from "@/app/Constants/pages";
import SidebarItem from "@/app/Components/SidebarItem";

interface SidebarProps {
    isVisible: boolean;
    onClose: () => void;
    currentPage: string;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Sidebar: React.FC<SidebarProps> = ({
    isVisible,
    onClose,
    currentPage,
                                         }) => {

    if (!isVisible) return null; //don't render if not visible
    return (
        <View style={styles.sidebarContainer}>
            {pages.map((page) => (
                <SidebarItem
                    key = {page.name}
                    pageKey={(page.name)}
                    icon={page.icon}
                    onClose={onClose}
                    isCurrentPage={currentPage.toLowerCase() === page.name}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    sidebarContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.darkGreen,
        justifyContent: "space-around",
        width: screenWidth * 0.7,
        position: 'absolute',
        paddingHorizontal: 5,
        height: screenHeight * 0.95,
        top: 60,
        left: 0,
        zIndex: 1000,
        elevation: 5, //Android shadow
        shadowColor: '#000', //Ios shadow
    },
})

export default Sidebar;