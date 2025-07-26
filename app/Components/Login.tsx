import React, {FC, useEffect} from "react";
import {useAuth} from "@/context/AuthContext";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {useTranslation} from "react-i18next";
import { Image } from 'react-native';
import {router} from "expo-router";
import logo from '../../assets/images/logo.png';
import * as yup from "yup";
import Form from "@/app/Components/Form";
import {showToastError} from "@/app/Services/ToastService/toast-service";
import * as Google from "expo-auth-session/providers/google";
import AntDesign from "@expo/vector-icons/FontAwesome5";
import i18n from "@/i18n";

export interface LoginRequest {
    email: string;
    password: string;
}

const Login: FC = () => {
    const {onLogin, onGoogleLogin } = useAuth();
    const { t } = useTranslation();
    const [ request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'clientId',
    });

    //translations not loaded yet, return loading
    if (!i18n.isInitialized) {
        return <ActivityIndicator size="large" color="#00AA88" />;
    }


    const login = async (request: LoginRequest) => {
        if (onLogin) {
            const result = await onLogin(request.email, request.password);
            if (result.error) {
                //TODO: catch and display correctly backend errors
                showToastError(t("badCredentials"));
            }
        }
    };

    useEffect(() => {
        if (response?.type === 'success') {
            onGoogleLogin(response.authentication?.idToken)
                .catch(() => showToastError("loginError")); // manejar error si falla login
        }
    }, [response]);

    const register  = async () => {
        router.navigate(`/Screens/register`);
    }

    const schema = yup.object().shape({
        email:  yup
            .string()
            .required("emailRequired")
            .email("emailInvalid"),
        password:yup
            .string()
            .required("passwordRequired")
            .min(8, "passwordMin"),
    });

    const fields = [
        {
            key: "email",
            placeholder: t("email"),
            secureTextEntry: false,
            icon: "at",
        },
        {
            key: "password",
            icon: "lock",
            placeholder: t("password"),
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
                    fields={fields}
                    formSubmit={login}
                >
                    <TouchableOpacity onPress={register}>
                        <Text style={styles.registerLink}>{t("noAccount")}</Text>
                    </TouchableOpacity>
                </Form>
                <TouchableOpacity
                    style={styles.loginWithGoogle}
                    onPress={() => promptAsync().then(() => router.replace('/')).catch( () => {})}>
                    <AntDesign name="google" size={24} color={"gray"}/>
                    <Text style={[{color: "gray"}]}>{t("continueWithGoogle")}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
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
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'transparent',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    registerLink: {
        color: "#0000ff",
        fontSize: 14,
        fontWeight: "bold",
        textDecorationLine: "underline",
        textAlign: "center",
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





export default Login;