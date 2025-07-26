import { Text, View } from "react-native";
import { Stack } from "expo-router";
export default function Index() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Stack.Screen options={{ title: "Settings" }} />
            <Text>Settings Screen Content</Text>
        </View>
    );
}