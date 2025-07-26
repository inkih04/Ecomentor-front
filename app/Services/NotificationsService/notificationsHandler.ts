import * as Notifications from 'expo-notifications';
import {SchedulableTriggerInputTypes} from 'expo-notifications';
import "@/i18n"
import i18n from "@/i18n";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function requestNotificationPermissions() {
    /* turn on if prod
    if (!Device.isDevice) {
        ToastService.showToastError("Error");
        return;
    }
    */

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
            return;
        }
    }
}

//function to send a notification with title title, body body and after seconds of calling the function
export async function scheduleNotification(title: string, body: string, seconds: number = 2) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: seconds,
        },
    });
}

export async function scheduleNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    //notif each hour
    const hourlyTimeStamp = 60 * 60;
    await Notifications.scheduleNotificationAsync({
        content: {
            title: i18n.t("notificationTitleHourly"),
            body: i18n.t("notificationBodyHourly"),
        },
        //code from official expo web
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: hourlyTimeStamp,
            repeats: true,
        },
    });
    //notif each day at specified hour and minute
    await Notifications.scheduleNotificationAsync({
        content: {
            title: i18n.t("notificationTitleDaily"),
            body: i18n.t("notificationBodyDaily"),
        },
        //code from official expo web
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 15,
            minute: 10,
        },
    });

    //TODO add a daily notification (as in type: daily)
}

