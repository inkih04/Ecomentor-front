import {Text, View} from "react-native";
import {Stack} from "expo-router";
import CertificatesList from "@/app/Components/CertificatesList";
import VinculationList from "@/app/Components/CertificatesList/VinculationList";

export default function Index() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Stack.Screen options={{ title: "test" }} />
            <VinculationList certificateIds={[13, 14, 15, 16]} userId={2}/>
        </View>
    );
}