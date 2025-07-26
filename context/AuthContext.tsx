import React, { createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

// Expected form of the responses received by the API
interface AuthResponse {
    token?: string;
    error?: boolean;
    msg?: string;
}

// Props needed for the useAuth hook.
interface AuthProps {
    authState?: { token: string | null; authenticated: boolean  | null};
    onRegister?: (email: string, name:string, password: string) => Promise<AuthResponse>;
    onLogin?: (email: string, password: string) => Promise<AuthResponse>;
    onLogout?: () => Promise<AuthResponse>;
    onGoogleLogin?: (promptAsync: any) => Promise<AuthResponse>;
}

// Props needed by the provider
interface AuthProviderProps {
    children: React.ReactNode;
}

//TODO move token and API url somewhere else? not good for production
const TOKEN_KEY = 'my-jwt-token';
export const  API_URL = "http://10.0.2.2:8080";
const AuthContext = createContext<AuthProps>({});
export const useAuth = () => {
    return useContext(AuthContext);
};

WebBrowser.maybeCompleteAuthSession();


export const AuthProvider = ({children} : AuthProviderProps) => {
    //Auth state control
    const [ authState, setAuthState ] = useState<{
        token: string | null;
        authenticated: boolean  | null
    }>({
        token: null,
        authenticated: null,
    });

    //Load the token if present upon start of the application
    useEffect( () => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            if( token) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + `${token}`;
                setAuthState({
                    token: token,
                    authenticated: true,
                });
            }
            else {
                setAuthState({
                    token: token,
                    authenticated: false,
                });
            }
        }
        loadToken().catch();
    }, [] )

    //Call to the api to register the user
    const register = async (email: string, name:string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/auth/register`, {name, email, password});
            setAuthState({
                token: result.data.token,
                authenticated: true,
            })

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + `${result.data.token}`;
            await AsyncStorage.setItem(TOKEN_KEY, result.data.token);

            return result;

        } catch (e) {
            return { error: true, msg: e};
        }
    }

    //Call to the api to authenticate
    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {email, password});
            setAuthState({
                token: result.data.token,
                authenticated: true,
            })
            //Required to add the token to all future API calls
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + `${result.data.token}`;
            //Saves the token using expo secure store
            await AsyncStorage.setItem(TOKEN_KEY, result.data.token);

            return result;
        } catch (e) {
            return { error: true, msg: e};
        }
    }

    //Delete authentication context upon logout
    const logout = async () => {
        try {
            //Delete token from local storage
            await AsyncStorage.removeItem(TOKEN_KEY);
            //Required to add the token to all future API calls
            axios.defaults.headers.common['Authorization'] = '';

            setAuthState({
                token: null,
                authenticated: false,
            })

        } catch (e) {
            return { error: true, msg: e};
        }
    }

    const onGoogleLogin = async (idToken) => {
        try {
            const res = await axios.post<AuthResponse>(`${API_URL}/auth/google`, {
                idToken
            });

            setAuthState({
                token: res.data.token ?? "",
                authenticated: true,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            await AsyncStorage.setItem(TOKEN_KEY, res.data.token ?? "");

            return res;
        } catch (e) {
            return { error: true, msg: e };
        }
    }


    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState: authState,
        onGoogleLogin: onGoogleLogin
    } as AuthProps;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}