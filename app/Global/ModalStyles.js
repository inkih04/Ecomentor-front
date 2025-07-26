import { StyleSheet } from 'react-native';
import colors from "../Constants/colors.js";

export default StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 25,
        paddingBottom: 15,
        width: "90%",
        maxHeight: "75%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: colors.darkGreen,
    },
    modalList: {
        gap: 10,
    },
    modalCloseButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 10,
        alignSelf: 'center',
    },
    modalCloseButtonText: {
        color: "#007AFF",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    modalItem: {
        alignSelf: "center",
        backgroundColor: colors.forestGreen,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 12,
        borderRadius: 20,
        elevation: 5,
        minWidth: 150,
    },
    modalItemText: {
        textAlign: 'center',
        fontSize: 20,
        color: colors.subtleWhite,
        fontWeight: 'bold',
    },
});