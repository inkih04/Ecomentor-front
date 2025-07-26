import React, {useEffect, useState} from "react";
import Form, {FormField} from "@/app/Components/Form";
import {router} from "expo-router";
import {Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import i18n from "@/i18n";
import AntDesign from "@expo/vector-icons/AntDesign";
import colors from "@/app/Constants/colors";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/context/AuthContext";
import {deleteUser, updateSelfUser} from "@/app/Services/UserService/user-service";
import * as yup from "yup";
import User from "@/app/Services/UserService/user";
import {showToastInfo, showToastSuccess} from "@/app/Services/ToastService/toast-service";

export interface ProfileDetailsProps {
    user: User;
    setUser: (user: User) => void;
}

const ProfileDetails: React.FC <ProfileDetailsProps> = ({user, setUser})  => {
    const { t } = useTranslation();
    const { onLogout } = useAuth();
    const [fields, setFields] = useState<FormField[]>([
        {
            key: "email",
            placeholder: t("email"),
            secureTextEntry: false,
            disabled: true,
            value: "",
        },
        {
            key: "name",
            placeholder: t("name"),
            secureTextEntry: false,
            value: "",
        }
    ])
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if(user){
            setFields([
                {
                    key: "email",
                    icon: "at",
                    placeholder: "email",
                    secureTextEntry: false,
                    value: user.email,
                    disabled: true,
                },
                {
                    key: "name",
                    icon: "address-card",
                    placeholder: "name",
                    secureTextEntry: false,
                    value: user.name,
                }
            ]);
        }
    }, [user]);

    const schema = yup.object().shape({
        email:  yup
            .string()
            .required("emailRequired")
            .email("emailInvalid"),
        name: yup
            .string()
            .required("nameRequired"),
    });

    const updateProfile = (updatedProfile: User)  => {
        setUser(user);
        updateSelfUser(updatedProfile).then(
            (next) => showToastSuccess("Profile updated!", "Your profile was updated successfully")
        );
    }

    const logout = async () => {
        if (onLogout) {
            await onLogout().then( () => showToastInfo(t("loggedOut")));
        }
    }

    const deleteProfile = async () => {
        //TODO implement proper modal
        if( !modalVisible) setModalVisible(!modalVisible);
        else{
            if(user){
                deleteUser(user).then(
                    () => {
                        if (onLogout) {
                            onLogout();
                        }
                    }
                );
            }
            setModalVisible(false);
        }
    }

    return (
        <View style={styles.body}>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{t("deleteProfile")}</Text>
                        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "80%"}}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => deleteProfile()}>
                                <AntDesign name="check" size={24} color="white" style={styles.icon} />
                                <Text style={styles.buttonText}>{t("delete")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <AntDesign name="close" size={24} color="white" style={styles.icon} />
                                <Text style={styles.buttonText}>{t("cancel")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.formContainer}>
                <Form
                    schema={schema}
                    formSubmit={updateProfile}
                    fields={fields}
                    action={"save"}
                >
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => { i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en'); showToastInfo(t("changedLanguage"))}}>
                            <AntDesign name="earth" size={24} color="white" style={styles.icon} />
                            <Text style={styles.buttonText}>{t("switchLanguage")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={logout}>
                            <AntDesign name="logout" size={24} color="white" style={styles.icon} />
                            <Text style={styles.buttonText}>{t("logout")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonDelete} onPress={deleteProfile}>
                            <AntDesign name="deleteuser" size={24} color="white" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </Form>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    formContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    buttonsContainer:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginTop: 10,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.darkGreen,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonDelete:{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F00",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        marginLeft: 8,
    },
    icon: {
        color: "white",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default ProfileDetails;