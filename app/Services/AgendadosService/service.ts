import { CalendarEvent } from "@/app/Constants/calendar"
import axios from "axios"
import { showToastError } from "../ToastService/toast-service";

const  API_URL = "http://10.0.2.2:8080";

export interface EventFetchProps {
    latMin: number;
    latMax: number;
    lonMin: number;
    lonMax: number;

}
export const fetchAgendadosEvents = async function ({ latMin, latMax, lonMin, lonMax }: EventFetchProps)
    : Promise<CalendarEvent[] | undefined> {

    const query = `?latMin=${latMin}&latMax=${latMax}&lonMin=${lonMin}&lonMax=${lonMax}&`
    try {
        const response = await axios.get(`${API_URL}/api/agendados${query}`
        );

        if (response.status != 200) {
            showToastError("Error fetching events", response.statusText);
            return undefined;
        }


        return response.data as CalendarEvent[];
    } catch (error) {
        showToastError("Error fetching events", "An error was found");
        return undefined;
    }
}

export default fetchAgendadosEvents;