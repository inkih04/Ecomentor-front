import React from 'react';
import Register from "@/app/Components/Register";
import colors from "@/app/Constants/colors";
import {View} from "react-native";



export default function Index(){
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.darkGreen}}>
            <Register></Register>
        </View>
    )
};
