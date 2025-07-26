import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { CalendarEventProps } from "@/app/Constants/calendar";
import EventCard from "./EventCard";

import React from "react";

interface EventButtomSheetProps {
    events: CalendarEventProps[];
}

const snapPoints = ['10%', '50%', '90%'];
const MAX_RENDER_PER_BATCH = 5;
const INITIAL_NUM_TO_RENDER = 10;



export const EventButtomSheet: React.FC<EventButtomSheetProps> = ({ events }) => {
    return (
        <BottomSheet snapPoints={events.length > 0 ? snapPoints : undefined} >
            <BottomSheetFlatList
                key={JSON.stringify(events.map(e => e.id))}
                data={events}
                keyExtractor={item => String(item.id)}
                maxToRenderPerBatch={MAX_RENDER_PER_BATCH}
                initialNumToRender={INITIAL_NUM_TO_RENDER}
                renderItem={renderItem} />
        </BottomSheet>);
}

const styles = StyleSheet.create({
    view: {
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
});

const renderItem = function ({ item }: { item: CalendarEventProps }) {
    return <EventCard eventInfo={item} />;
}

export default EventButtomSheet;