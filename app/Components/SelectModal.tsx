import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import styles from "@/app/Global/ModalStyles";
interface modalProps<T> {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    data: T[];
    renderItem: ({ item }: { item: T }) => React.ReactElement;
    title?: string;
}

const SelectModal = <T,>({
                             modalVisible,
                             setModalVisible,
                             data,
                             renderItem,
                             title = "Select an item",
                         }: modalProps<T>) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                        style={styles.modalList}
                    />
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SelectModal;