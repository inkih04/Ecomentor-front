import React from "react";
import Achievement from "../Services/AchievementsService/achievement";
import {ScrollView, StyleSheet} from "react-native";
import {AchievementCard} from "@/app/Components/AchievementCard";


interface AchievementListProps{
    achievements: Achievement[];
}

export const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
    return (
        <ScrollView style={styles.container}>
            {
                achievements.map((achievementItem: Achievement, index) => {
                    return (
                            <AchievementCard
                                achievement = {achievementItem}
                                key={index}
                            />

                    )
                })
            }
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        columnGap: 100
    }
})