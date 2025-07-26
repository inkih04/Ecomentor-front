import {router, Stack, useSegments} from "expo-router";
import Navbar from "@/app/Components/Navbar";
import Sidebar from "@/app/Components/Sidebar";
import React, { useEffect } from "react";
import {AuthProvider, useAuth} from "@/context/AuthContext";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

/*  This file serves as a layout for the whole app (each page), since expo router will only
    replace the component inside the layout, but not the layout itself.
*/

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <AuthProvider>
                <Layout></Layout>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}

export function Layout() {
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState("home");
    const segments = useSegments();
    const { authState } = useAuth();
    useEffect(() => {
        const capitalize = (str:string) => str.charAt(0).toUpperCase() + str.slice(1);
        const pageName = segments.at(-1) || "home"; //-1 for the last element, to get the correct route
        setCurrentPage(capitalize(pageName));
    }, [segments]);

    useEffect(() => {
        if ( !authState || authState?.authenticated === false) router.navigate(`/Screens/welcome`);
        else if (authState?.authenticated === true) router.navigate(`/Screens/home`);
    }, [authState]);


    return (
        <>
            { authState?.authenticated
                ? (
                    <>
                        <Sidebar
                            isVisible={isSideBarOpen}
                            onClose={() => setIsSideBarOpen(false)}
                            currentPage={currentPage}
                        />
                        <Stack
                            screenOptions={{
                                //property of the screen, using the navbar and setting its title with the options from such page
                                headerShown: true,
                                header: ({ options }) => {
                                    return (
                                        (<Navbar pageTitle={options.title || "EcoMentor"}
                                                 toggleSidebar={() => setIsSideBarOpen(!isSideBarOpen)}/>
                                        )
                                    )}
                            }}
                        />
                    </>
                )
                : (
                    <>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                            }}
                        />
                    </>
                )
            }
            <Toast />
        </>
    )
}