import {View} from "react-native";
import {Stack} from "expo-router";
import Login from "@/app/Components/Login";
import React from "react";
import colors from "@/app/Constants/colors";

export default function Index() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.darkGreen }}>
            <Stack.Screen options={{ title: "welcome" }} />
            <Login ></Login>
        </View>
    );
}