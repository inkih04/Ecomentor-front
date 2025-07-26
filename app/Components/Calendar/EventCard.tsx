import { CalendarEventProps } from "@/app/Constants/calendar"
import { StyleSheet, View, Text, Image, Pressable, Dimensions } from "react-native";
import { Card } from "@rneui/themed";
import { useTranslation } from "react-i18next";
import { Linking } from 'react-native';
import colors from "@/app/Constants/colors";
import { parseISOToDateData } from "@/app/Utils/date";

import React from "react";

const width = Dimensions.get('screen').width;

interface EventCardProps {
    eventInfo: CalendarEventProps;
}

export const EventCard: React.FC<EventCardProps> = ({ eventInfo }) => {
    const { t } = useTranslation();

    return <Card containerStyle={styles.container}>
        <View style={styles.titleContainer}>
            <View style={[styles.titleColor, { backgroundColor: eventInfo.color }]} />
            <Text style={styles.title}>{eventInfo.title}</Text>
        </View>
        <Card.Divider />
        <Text style={styles.text}>{eventInfo.description}</Text>
        <Text style={styles.subtitle}>{t('info')}</Text>
        <Text style={styles.text}>{eventInfo.info_tickets}</Text>
        <Text style={styles.subtitle}>{t('date')}</Text>
        {
            eventInfo.date_ini == eventInfo.date_end ? <DateDisplay date={eventInfo.date_ini} label="" /> :
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <DateDisplay date={eventInfo.date_ini} label={t('from')} />
                    <DateDisplay date={eventInfo.date_end} label={t('to')} />
                </View>

        }
        <Text style={styles.subtitle}>{t('schedule')}</Text>
        <Text style={styles.text}>{eventInfo.schedule}</Text>
        <Text style={styles.subtitle}>{t('categories')}</Text>
        <View style={styles.categoryContainer}>
            {
                eventInfo.categories.map((category) => <Text key={category.id}
                    style={[styles.text, styles.textImportant]}>{category.name}
                </Text>)
            }
        </View>
        <Text style={styles.subtitle}>{t('location')}</Text>
        <Text style={styles.subtitle2}>{`${t('at')} ${eventInfo.location.space}`}</Text>
        <Text style={styles.text}>{`${eventInfo.location.address}, ${eventInfo.location.town.name}, ${eventInfo.location.region.name}`}</Text>
        <Text style={styles.subtitle}>{t('links')}</Text>
        <View style={styles.listContainer}>
            {
                eventInfo.links.map((link) =>
                    <Pressable key={link.link}
                        onPress={() => Linking.openURL(link.link)}>
                        <Text style={[styles.text, styles.link]}>
                            {link.link}
                        </Text>
                    </Pressable>)
            }
        </View>
        <Text style={styles.subtitle}>{t('gallery')}</Text>
        <View style={styles.imagesContainer}>
            {
                eventInfo.images.map((image) => <Image key={image.image_url}
                    style={styles.image}
                    resizeMode="contain"
                    source={{ uri: image.image_url }} />)
            }
        </View>
    </Card >
}

const DateDisplay: React.FC<{ date: string, label: string }> = ({ date, label }) => {
    const data = parseISOToDateData(date);

    return <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.subtitle2, { marginRight: 10, alignSelf: 'center' }]}>{label}</Text>
        <Text style={[styles.text, { textAlignVertical: 'bottom' }]}>{`${data.date}, at ${data.time} UTC${data.timezoneUTC}`}</Text>
    </View>
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '800',
        fontSize: 16,
        textAlign: 'center',
        maxWidth: width - 100,
    },
    titleColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 15,
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    container: {
        borderWidth: 0,
        backgroundColor: '#f2f6eb',
        borderRadius: 30,
        paddingBottom: 15,
    },
    subtitle: {
        marginTop: 15,
        fontWeight: '600',
        fontSize: 14,
    },
    subtitle2: {
        marginTop: 6,
        fontWeight: '600',
        fontSize: 12,
    },
    text: {
        fontSize: 12,
    },
    textImportant: {
        fontWeight: '500',
    },
    link: {
        textDecorationLine: 'underline',
        color: colors.darkGreen
    },
    categoryContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    imagesContainer: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        gap: 10,
    },
    image: {
        height: 120,
        aspectRatio: 1,
    },
});

export default EventCard;