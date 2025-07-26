import {CalendarProps, LocaleConfig} from 'react-native-calendars';
import { CalendarEvent, CalendarEventProps } from '@/app/Constants/calendar';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateColorPalette } from '../Utils/color';

type BaseMarkedDatesType = CalendarProps['markedDates'];
type MarkedDates = NonNullable<BaseMarkedDatesType>;
type MarkingProps = MarkedDates[string];

interface UseEventCalendarProps {
    markingProps: MarkingProps;
    selectedProps: MarkingProps;
    todaySelectedProps: MarkingProps;
    events: CalendarEvent[];
}

interface MarkingEventProps extends MarkingProps {
    events: CalendarEventProps[];
}

const YEAR_MILLISECONDS = 12 * 30 * 24 * 60 * 60 * 1000;

export const useEventCalendar = function ({ markingProps, selectedProps, todaySelectedProps, events }: UseEventCalendarProps) {
    const today = new Date(Date.now());
    const todayString = today.toISOString().slice(0, 10);
    const [selectedDay, setSelectedDay] = useState(today.toISOString().slice(0, 10));

    const minimumDate = new Date(Date.now() - YEAR_MILLISECONDS);
    const maximumDate = new Date(Date.now() + YEAR_MILLISECONDS);

    const defaultMarkingProps = useMemo(() => getDottedMarkingDatesMap(events, markingProps), [events]);

    const eventMap = useMemo(() => {
        const map = new Map<string, MarkingProps>();
        return map;
    }, [events]);


    const { i18n } = useTranslation();

    const [eventDates, setEventDates] = useState<MarkedDates>(() => {
        eventMap.set(todayString, todaySelectedProps);
        return Object.fromEntries(
            Array.from(
                new Set([
                    ...defaultMarkingProps.keys(),
                    ...eventMap.keys()
                ])
            ).map(date => {
                return [date, { ...defaultMarkingProps.get(date), ...eventMap.get(date) }];
            }))
    });

    const changeDates = function (current: string, prev: string) {
        if (eventMap.has(prev)) {
            eventMap.delete(prev);
        }

        eventMap.set(
            current,
            current === todayString
                ? { ...selectedProps, ...todaySelectedProps }
                : { ...selectedProps }
        );
        const newEventDates = Object.fromEntries(
            Array.from(
                new Set([
                    ...defaultMarkingProps.keys(),
                    ...eventMap.keys()
                ])
            ).map(date => {
                return [date, { ...defaultMarkingProps.get(date), ...eventMap.get(date) }];
            }));

        setEventDates(newEventDates);
    };

    const [pastMonths, futureMonths] = getDeltaMonths(minimumDate, maximumDate);
    LocaleConfig.defaultLocale = 'en';

    return {
        eventDates,
        selectedDayEvents: defaultMarkingProps.get(selectedDay)?.events ?? [],
        setSelectedDay: (date: string) => {
            changeDates(date, selectedDay);
            setSelectedDay(date);
        },

        minDate: minimumDate.toISOString().slice(0, 10),
        maxDate: maximumDate.toISOString().slice(0, 10),
        pastScrollRange: pastMonths,
        futureScrollRange: futureMonths,
    }
}

const getDeltaMonths = function (minDate: Date, maxDate: Date): [number, number] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function monthDiff(from: Date, to: Date): number {
        let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
        if (to.getDate() < from.getDate()) {
            months -= 1;
        }
        return months;
    }

    const totalMinMonths = monthDiff(minDate, today);
    const totalMaxMonths = monthDiff(today, maxDate);

    return [totalMinMonths, totalMaxMonths];
}

const getDottedMarkingDatesMap = function (events: CalendarEvent[], markingProps: MarkingProps) {
    const colorPalette = generateColorPalette(events.length);
    const map = new Map<string, MarkingEventProps>();
    events.forEach((event, index) => {
        const color = colorPalette[index];

        let currentDate = new Date(event.date_ini);
        const endDate = new Date(event.date_end);

        // Sets all the marling props and miscellaneous data to the corresponding dates
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().slice(0, 10);
            if (!map.has(dateStr)) {
                map.set(dateStr, { ...markingProps, events: [] })
            }

            map.get(dateStr)?.events.push({ ...event, color });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return map;
}

const getMultiPeriodMarkingDatesMap = function (events: CalendarEvent[]) {
    // get all dates
    const colorPalette = generateColorPalette(events.length);
    const map = new Map<string, MarkingEventProps>();
    events.forEach((event, index) => {
        const color = colorPalette[index];

        let currentDate = new Date(event.date_ini);
        const endDate = new Date(event.date_end);

        // find index to put the periods
        let largestIndex = 0;
        while (currentDate <= endDate) {
            const periods = map.get(currentDate.toISOString().slice(0, 10))?.periods;
            if (periods !== undefined) {
                largestIndex = Math.max(largestIndex, periods.length);
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // fill all periods
        // Helper to push a period at the right index, filling with transparent if needed
        function pushPeriod(dateStr: string, period: { color: string; startingDay?: boolean; endingDay?: boolean }) {
            let periods = map.get(dateStr)?.periods;
            if (periods !== undefined) {
                while (periods.length < largestIndex) {
                    periods.push({ color: 'transparent' });
                }
                periods.push(period);
            } else {
                const newPeriods: { color: string; startingDay?: boolean; endingDay?: boolean }[] = [];
                while (newPeriods.length < largestIndex) {
                    newPeriods.push({ color: 'transparent' });
                }
                newPeriods.push(period);

                map.set(dateStr, { periods: newPeriods, events: [] });
            }
        }

        // Start day
        pushPeriod(event.date_ini, { startingDay: true, endingDay: event.date_ini === event.date_end, color });

        // Middle days
        currentDate = new Date(event.date_ini);
        currentDate.setDate(currentDate.getDate() + 1);

        while (currentDate < endDate) {
            const dateStr = currentDate.toISOString().slice(0, 10);
            pushPeriod(dateStr, { startingDay: false, endingDay: false, color });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // End day
        if (event.date_ini !== event.date_end)
            pushPeriod(event.date_end, { startingDay: false, endingDay: true, color });


        // Finally, sets all miscellaneous data to the corresponding dates
        currentDate = new Date(event.date_ini);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().slice(0, 10);
            map.get(dateStr)?.events.push({ ...event, color });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return map;
}

export default useEventCalendar;