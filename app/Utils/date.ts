

interface DateData {
    date: string;
    time: string;
    timezoneUTC: string;
}

export function parseISOToDateData(isoString: string): DateData {
    const dateObj = new Date(isoString);

    // Extract date in YYYY-MM-DD
    const date = dateObj.toISOString().slice(0, 10);

    // Extract time in HH:mm:ss
    const time = dateObj.toISOString().slice(11, 19);

    // Extract timezone from the original string
    const match = isoString.match(/([+-]\d{2}:\d{2}|Z)$/);
    const timezoneUTC = match ? match[1] : 'Z';

    return { date, time, timezoneUTC };
}

export default {};