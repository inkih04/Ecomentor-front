
import colors from "@/app/Constants/colors";
import useEventCalendar from "@/app/CustomHooks/useEventCalendar";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View, Text } from "react-native";
import {Calendar, CalendarProps, DateData} from 'react-native-calendars';
import { CalendarEvent } from "@/app/Constants/calendar";
import EventButtomSheet from "./EventButtomSheet";
import { EventFetchType } from "@/app/CustomHooks/useEvent";
import { useTranslation } from "react-i18next";
import { getCertificateLabel } from "@/app/Utils/certificate/certificate";

type Theme = NonNullable<CalendarProps['theme']>;

interface CustomEventAgendaProps {
    events: CalendarEvent[];
    fetchType: EventFetchType;
    certificateSelected?: Record<string, any>;
}

export const CustomEventAgenda: React.FC<CustomEventAgendaProps & PropsWithChildren> = ({ events, children, fetchType, certificateSelected }) => {
    const { t } = useTranslation();
    const props = useEventCalendar({ markingProps, selectedProps, todaySelectedProps, events: events !== undefined ? events : [] });
    const { eventDates, setSelectedDay, selectedDayEvents } = props;

    const titleText = fetchType == 'barcelona' ? t('nearBarcelona') : fetchType == 'location' ? t('nearYou') : certificateSelected !== undefined ?
        `${t('nearCertificateIn')} ${getCertificateLabel(certificateSelected)}` : '';

    return (<View style={styles.view}>
        <View style={styles.nonModalView}>
            <Text style={styles.title}>{titleText}</Text>
            <Calendar {...props}
                markedDates={eventDates}
                onDayPress={(date: DateData) => setSelectedDay(date.dateString)}
                style={styles.container}
                theme={calendarTheme}
            />
            {children}
        </View>
        <EventButtomSheet events={selectedDayEvents} />
    </View>);
}

const markingProps = {
    dotColor: colors.darkGreen,
    marked: true,
}

const selectedProps = {
    selectedTextColor: 'white',
    selectedColor: colors.forestGreen,
    selected: true,
    disableTouchEvent: true,
}

const todaySelectedProps = {
    ...selectedProps,
    selectedTextColor: '#FFC107',
}

export const calendarTheme: Theme = {
    calendarBackground: colors.subtleWhite,
    textSectionTitleColor: 'black',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#FFC107',
    dayTextColor: colors.forestGreen,
    textDisabledColor: '#d9e1e8',

    disabledArrowColor: '#d9e1e8',
    arrowColor: colors.yellowishGreen,

    monthTextColor: colors.darkGreen,

    textDayFontWeight: '300',
    textMonthFontWeight: '900',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 10,
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.darkGreen,
        alignSelf: 'center',
    },
    view: {
        flex: 1,

        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    },
    nonModalView: {
        gap: 15,
        margin: 15,
    },
    container: {
        borderRadius: 30,
        paddingBottom: 20,
        backgroundColor: colors.subtleWhite,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
});



export default CustomEventAgenda;