import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import CustomEventAgenda from "@/app/Components/Calendar/CustomEventAgenda";
import { useTranslation } from "react-i18next";
import EventButtomSheet from "@/app/Components/Calendar/EventButtomSheet";
import useEvent, { UseEventProps } from "@/app/CustomHooks/useEvent";
import { useReducer, useState } from "react";
import "@/app/Constants/calendar";
import EventFetchView from "@/app/Components/Calendar/EventFetchView";

export default function Index() {
    const { t } = useTranslation();

    const [eventFetchType, dispatch] = useReducer(handleOnEventFetch, { barcelona: true });
    const { events, isLoading, userCertificates, eventsFetchType, getCertificate } = useEvent(eventFetchType);

    return (
        <View style={styles.view}>
            <Stack.Screen options={{ title: t("calendar") }} />
            {
                isLoading ? <ActivityIndicator size='large' /> :
                    <CustomEventAgenda
                        events={events ?? []}
                        fetchType={eventsFetchType}
                        certificateSelected={getCertificate(eventFetchType.certificateId ?? -1)}>
                        <EventFetchView onFetchSelected={(fetchType: UseEventProps) => dispatch(fetchType)}
                            certificates={userCertificates} />
                    </CustomEventAgenda>
            }
        </View>
    );
}

const handleOnEventFetch = function (state: UseEventProps, action: UseEventProps): UseEventProps {
    if (action.barcelona && state.barcelona === action.barcelona)
        return state;
    if (action.userLocation && state.userLocation === action.userLocation)
        return state;
    if (action.certificateId && state.certificateId === action.certificateId)
        return state;

    return action;
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});