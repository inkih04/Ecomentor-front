import axios from "axios";
import {API_URL} from "@/context/AuthContext";
import Achievement, {achievementImages} from "@/app/Services/AchievementsService/achievement";
import {Asset} from "expo-asset";
import {Alert, Platform} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const fetchAchievements = async () => {
    const result = await axios.get(`${API_URL}/api/achievement`);
    const resultData = result.data;
    return resultData as Achievement[];
}

export const shareAchievement = async (achievementName: string, t: (key: string) => string) => {
    const asset = Asset.fromModule(achievementImages[achievementName]);

    try {
        await asset.downloadAsync();
        if (!asset.localUri) {
            Alert.alert("Error", t("imageObtainError"));
            return;
        }

        let fileUriToShare = asset.localUri;

        if (Platform.OS === 'android') {
            const directory = FileSystem.cacheDirectory + 'instagram_stories/';
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            const newPath = directory + achievementName;
            await FileSystem.copyAsync({
                from: asset.localUri,
                to: newPath,
            });
            fileUriToShare = newPath;
        }

        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (!isSharingAvailable) {
            Alert.alert("Error", t("sharingIsDisabled"));
            return;
        }

        const shareOptions = {
            mimeType: asset.type === 'jpg' ? 'image/jpeg' : 'image/png',
            dialogTitle: 'Share your Eco-Achievement!',
        };

        //let user choose where he wants to share
        await Sharing.shareAsync(fileUriToShare, shareOptions);

    } catch (error) {
        Alert.alert("Error", t("errorMessageGeneric"));
    }
};