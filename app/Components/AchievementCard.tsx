import React from "react";
import Achievement, {achievementIcons} from "../Services/AchievementsService/achievement";
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from "react-native";
import colors from "@/app/Constants/colors";
import {useTranslation} from "react-i18next";
import * as Progress from 'react-native-progress';
import {shareAchievement} from "@/app/Services/AchievementsService/achievement-service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


const CARD_SIZE = Dimensions.get("window").width - 40;

interface AchievementCardProps{
    achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
    const { t } = useTranslation();
    const progress: number = achievement.actualProgress/achievement.maxProgress;
    const completed: boolean = (progress === 1);
    const icon: keyof typeof MaterialIcons.glyphMap = achievementIcons[achievement.achievementName];

    return (
        <View style={styles.wrapper}>
            <View style={[styles.card, { backgroundColor: completed ? colors.forestGreen : colors.grey }]}>
                <View style={styles.header}>
                    <MaterialIcons name={icon} size={36} color={colors.subtleWhite} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {t(`achievementTexts.${achievement.achievementName}.name`)}
                        </Text>
                        <Text style={styles.description}>
                            {t(`achievementTexts.${achievement.achievementName}.description`)}
                        </Text>
                    </View>
                </View>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>

                        {achievement.actualProgress} / {achievement.maxProgress}
                    </Text>
                    <Progress.Bar
                        progress={progress}
                        width={null}
                        color={colors.forestGreen}
                        unfilledColor="#e0e0e0"
                        borderRadius={8}
                        height={10}
                        style={styles.progressBar}
                    />
                    {completed && (
                        <TouchableOpacity
                            onPress={() => shareAchievement(`${achievement.achievementName}.png`, t)}
                        >
                            <MaterialIcons name="share" size={36} color={colors.subtleWhite} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    card: {
        width: CARD_SIZE,
        borderRadius: 16,
        padding: 16,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.subtleWhite,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: colors.subtleWhite,
        opacity: 0.8,
    },
    progressContainer: {
        marginTop: 8,
        alignItems: "center",
    },
    progressText: {
        fontSize: 12,
        color: colors.subtleWhite,
        marginBottom: 8,
        alignSelf: "center",
    },
    progressBar: {
        width: "100%",
        marginBottom: 12,
    }
});
