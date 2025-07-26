import {BanStatus, CertificateDTO, Message} from "@/app/Constants/types";
import axios from 'axios';
import "@/i18n";
import i18n from "@/i18n";
export const  API_URL = "http://10.0.2.2:8080";
export async function sendCertificateAsContext(chatTitle: string, userId: number | undefined, certificateId: number) {
    try {
        const response = await axios.post(`${API_URL}/api/chat/context`, {
            chatName: chatTitle,
            certificateId: certificateId,
            message: i18n.t("certificateContextPrompt"),
        });
        const output: Message = {
            text: response.data.response,
            isUser: false,
            timestamp: new Date(response.data.timestamp).toUTCString(),
        }
        return output;
    }
    catch (error) {
        throw error;
    }
}

export async function getChatsFromUser(userId: number | undefined) {
    try {
        const response = await axios.get(`${API_URL}/api/chat/names`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function loadChatFromUser(userId: number | undefined, chatTitle: string): Promise<Message[]> {
    try {
        const response = await axios.get(`${API_URL}/api/chat/${encodeURIComponent(chatTitle)}`);

        const unformattedMessages = response.data;

        return unformattedMessages.flatMap((entry: any) => {
            const messages: Message[] = [];

            //user msg
            if (entry.message) {
                //avoid the initial prompt msg
                if (!(entry.message === i18n.t("contextPrompt")) && !(entry.message.startsWith(i18n.t("certificateContextPrompt")))) {
                    messages.push({
                        text: entry.message,
                        isUser: true,
                        timestamp: new Date(entry.timestamp).toUTCString(),
                    });
                }
                else if (entry.message.startsWith(i18n.t("certificateContextPrompt"))) {
                    const certificateSentMessage: Message = {
                        text : "Could you analize my certificate?",
                        isUser : true,
                        timestamp : new Date().toUTCString(),
                        suspicious : false
                    }
                    messages.push(certificateSentMessage);
                }
            }

            //bot answer to previous msg
            if (entry.response) {
                messages.push({
                    text: entry.response,
                    isUser: false,
                    timestamp: new Date(entry.timestamp).toUTCString(),
                });
            }
            return messages;
        });

    } catch (error) {
        throw error;
    }
}

//this is for the first time user enters, if it sends a message the chat will be called " Initial "
export async function createChatIfNotExistsAndSendMessage(userId: number | undefined, chatTitle: string,  newMessage: string, timeStamp: Date) {
    try {
        const response = await axios.post(`${API_URL}/api/chat`, {
            userId: userId,
            chatName: chatTitle,
            dateTime: timeStamp.toISOString(),
            message: newMessage,
        });
        const output: Message = {
            text: response.data.response,
            isUser: false,
            timestamp: new Date(response.data.timestamp).toUTCString(),
            suspicious: response.data.suspicious,
        }
        return output;
    }
    catch(error) {
        throw error;
    }
}

export async function getBanStatus(userId: number | undefined): Promise<BanStatus> {
    try {
        const response = await axios.get(`${API_URL}/api/chat/${userId}/ban-status`);
        return response.data as BanStatus;
    }
    catch (error) {
        throw error;
    }
}