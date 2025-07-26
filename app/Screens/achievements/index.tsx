import {View} from "react-native";
import {Stack} from "expo-router";
import "@/i18n";
import {AchievementList} from "@/app/Components/AchievementList";
import {useEffect, useState} from "react";
import {fetchAchievements} from "@/app/Services/AchievementsService/achievement-service";
import Achievement from "@/app/Services/AchievementsService/achievement";

//name has to have png so it previews in the app when clicking share

export default function Index() {
    const [ achievements, setAchievements ] = useState<Achievement[]>([]);
    //this function should be called if when updating an achievement the response tells us the achievement has been completed
    //then we send an alert and call this
    useEffect(
        () => {
            fetchAchievements().then(
                (achievements) => {
                    setAchievements(achievements)
                },
            )
        }
        ,[])

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Stack.Screen options={{ title: "Achievements" }} />
            <AchievementList achievements={achievements}></AchievementList>
        </View>
    );
}
