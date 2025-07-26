import React, {FC, useEffect} from "react";
import {Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useTranslation} from "react-i18next";
import logo from '../../assets/images/logo.png';
import {useAuth} from "@/context/AuthContext";
import * as yup from 'yup';
import Form, {FormField} from "@/app/Components/Form";
import {showToastError} from "@/app/Services/ToastService/toast-service";
import AntDesign from "@expo/vector-icons/FontAwesome5";
import * as Google from "expo-auth-session/providers/google";
import {router} from "expo-router";

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

const Register: FC = () => {
    const { onRegister, onGoogleLogin } = useAuth();
    const { t } = useTranslation();
    const [ request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'clientId',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            onGoogleLogin(response.authentication?.idToken)
                .catch(() => showToastError("loginError")); // manejar error si falla login
        }
    }, [response]);

    const schema = yup.object().shape({
        name: yup
            .string()
            .required(t("nameRequired")),
        email:  yup
            .string()
            .required("emailRequired")
            .email("emailInvalid"),
        password:yup
            .string()
            .required("passwordRequired")
            .min(8, "passwordMin"),
    });

    const register = async (request : RegisterRequest) =>{
        const result = await onRegister(request.email, request.name, request.password);
        //TODO: catch and display correctly backend errors
        if ( result && result.error){
            showToastError(t("badCredentials"));
        }
    }

    const fields: FormField[] = [
            {
                key: "name",
                placeholder: t("name"),
                secureTextEntry: false,
                icon: "user",
            },
            {
                key: "email",
                placeholder: t("email"),
                icon: "at",
                secureTextEntry: false,
            },
            {
                key: "password",
                placeholder: t("password"),
                inputMode: 'text',
                icon: "lock",
                secureTextEntry: true,
            }]


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.outerContainer}
        >
            <View style={styles.container}>
                <Image
                    source={logo}
                    style={styles.image}
                />
                <Form
                    schema={schema}
                    formSubmit={register}
                    fields={fields}
                >
                </Form>
                <TouchableOpacity
                    style={styles.loginWithGoogle}
                    onPress={() => promptAsync().then(() => router.replace('/')).catch( () => {})}>
                    <AntDesign name="google" size={24} color={"gray"}/>
                    <Text style={[{color: "gray"}]}>{t("continueWithGoogle")}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    outerContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container:{
        justifyContent: "center",
        alignItems: "center",
        width: '90%',
        backgroundColor: 'transparent',
        paddingVertical: 30,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    loginWithGoogle: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    }
});


export default Register;