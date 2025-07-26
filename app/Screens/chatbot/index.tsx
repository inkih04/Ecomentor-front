import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal,
    ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from "@/app/Constants/colors";
import modalStyles from "@/app/Global/ModalStyles";
import {
    createChatIfNotExistsAndSendMessage, getBanStatus,
    getChatsFromUser,
    loadChatFromUser,
    sendCertificateAsContext,
} from "@/app/Services/ChatBotService/chat";
import {showToastError, showToastSuccess} from "@/app/Services/ToastService/toast-service";
import SelectModal from "@/app/Components/SelectModal";
import User from "@/app/Services/UserService/user";
import {fetchProfile} from "@/app/Services/UserService/user-service";
import {CertificateDTO, Message} from "@/app/Constants/types";
import "@/i18n";
import {useTranslation} from "react-i18next";
import {Stack} from "expo-router";
import axios from "axios";

interface OptionButtonProps {
    text: string;
    onPress: () => void;
    additionalStyles?: ViewStyle;
}

/*
    TODO -> fix date issue when sending a message
*/
const OptionButton: React.FC<OptionButtonProps> = ({ text, onPress, additionalStyles }) => (
    <TouchableOpacity
        style={[styles.optionButton, additionalStyles]}
        onPress={onPress}
    >
        <Text style={styles.optionText}>
            {text}
        </Text>
    </TouchableOpacity>
);

export default function EcoBotChatContent() {
    const [user, setUser] = useState<User | null>(null);
    const userId = user?.id;
    const { t } = useTranslation();
    //UI information
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);
    //select certificate info
    const [isCertificateModalVisible, setIsCertificateModalVisible] = useState(false);
    const [certificates, setCertificates] = useState<CertificateDTO[]>([]);
    //chat information
    const [isSelectChatModalVisible, setIsSelectChatModalVisible] = useState(false);
    const [userChatNames, setUserChatNames] = useState<string[]>([]);
    const [currentChat, setCurrentChat] = useState<string>("");
    const [isCreateChatModalVisible, setIsCreateChatModalVisible] = useState(false);
    const [newChatTitle, setNewChatTitle] = useState<string>("");
    //ban information
    const [isBanned, setIsBanned] = useState(false);
    const [banEndTime, setBanEndTime] = useState<string | null>(null);
    const [banReason, setBanReason] = useState<string>("");
    //when loading this component, whe get load the user too
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const fetchedUser = await fetchProfile();
                setUser(fetchedUser);
                const currentUserId = fetchedUser.id;
                if (!currentUserId) {
                    showToastError("Error", t("failedProfileFetch"));
                    return;
                }
                const responseBanStatus = await getBanStatus(currentUserId);
                if (responseBanStatus.banned) setBanReason(t("banned"));
                setIsBanned(responseBanStatus.banned);
                setBanEndTime(responseBanStatus.banEndTime);
                try {
                    const chats = await getChatsFromUser(currentUserId);
                    const hasInitialChat = chats.includes("initialChat");

                    if (hasInitialChat) {
                        await getAndLoadChat(currentUserId, "initialChat");
                    } else {
                        const receivedMessage: Message = await createChatIfNotExistsAndSendMessage(currentUserId, "initialChat", t("contextPrompt"), new Date());
                        setCurrentChat("initialChat");
                        setMessages([receivedMessage]);
                    }
                }
                catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 404) {
                            let receivedMessage:Message = await createChatIfNotExistsAndSendMessage(user?.id, "initialChat", t("contextPrompt"), new Date());
                            setCurrentChat(t("initialChat"));
                            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                        } else {
                            showToastError("Error", t("errorMessageGeneric"));
                        }
                    }
                }
                setIsLoading(false);
            }
            catch (profileError) {
                showToastError("Error", t("failedProfileFetch"));
            }
        };
        fetchUserData();

    }, [t]);

    const handleSelectCertificatePress = () => {
        if (user && user.certificateDTOList && user.certificateDTOList.length > 0) {
            setCertificates(user.certificateDTOList);
            setIsCertificateModalVisible(true);
        }
        else if (user && (!user.certificateDTOList || user.certificateDTOList.length === 0)) {
            showToastError("Error", t("noCertificatesFound"));
        }
    };

    //when selecting a certificate, it is sent to the bot with a prompt so it uses it as context to give recoomendations etc
    const setCertificateAsContext = async (certificate: CertificateDTO) => {
        try {
            setIsCertificateModalVisible(false);
            setIsLoading(true);
            let receivedMessage: Message;
            if (currentChat === "") {
                receivedMessage = await sendCertificateAsContext("initialChat", userId, certificate.certificateId);
                setCurrentChat(t("initialChat"));
            }
            else {
                receivedMessage = await sendCertificateAsContext(currentChat, userId, certificate.certificateId);
            }
            const certificateSentMessage: Message = {
                text : "Could you analize my certificate?",
                isUser : true,
                timestamp : new Date(),
                suspicious : false
            }
            setMessages((prevMessages) => [...prevMessages, certificateSentMessage]);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }
        catch (error) {
            showToastError("Error", t("failedToUseCertificate"));
        }
        finally {
            setIsLoading(false);
        }
    }

    const renderCertificateItem = ({ item }: { item: CertificateDTO }) => (
        <TouchableOpacity
            style={modalStyles.modalItem}
            onPress={() => setCertificateAsContext(item)}
        >
            <Text style={modalStyles.modalItemText}>{item.documentId}</Text>
        </TouchableOpacity>
    );

    const handleSelectChatPress = async () => {
        try {
            const chats = await getChatsFromUser(userId);

            if (chats && chats.length > 0) {
                setUserChatNames(chats);
                setIsSelectChatModalVisible(true)
            }
            else showToastError("Error", t("noChatsFound"));
        }
        catch {
            showToastError("Error",t("errorMessageGeneric"));
        }
    }

    //loads the chat from backend, then updates messages to display with the data loaded
    const getAndLoadChat = async (userId: number | undefined, chatTitle: string) => {
        setIsSelectChatModalVisible(false);
        setIsLoading(true);
        setMessages([]); //clear before loading the new ones
        setCurrentChat(chatTitle);
        try {
            const loadedMessages: Message[] = await loadChatFromUser(userId, chatTitle);
            setMessages(loadedMessages);
        }
        catch {
            showToastError("Error", t("errorMessageGeneric"));
            setMessages([]);
            setCurrentChat("");
        }
        finally {
            setIsLoading(false);
        }
    };

    const renderChatItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={modalStyles.modalItem}
            onPress={() => getAndLoadChat(userId, item)}
        >
            <Text style={modalStyles.modalItemText}>{item}</Text>
        </TouchableOpacity>
    );

    //creates a new chat checking if user has a chat with the same title, if it succeeds, switches to new chat
    const handleChatCreation= async () => {
        setIsLoading(true);
        try {
            const chats = await getChatsFromUser(userId);
            if (chats && chats.length > 0) {
                if (chats.find((value: string) => value === newChatTitle)) {
                    showToastError("Error", t("alreadyHaveChat"));
                    setNewChatTitle("");
                    return;
                }
                else try{
                    //we create a message and give the EcoMentor context to the chatbot.
                    const created = await createChatIfNotExistsAndSendMessage(userId, newChatTitle, t("contextPrompt"), new Date());
                    setCurrentChat(newChatTitle);
                    setMessages([created]);
                    setNewChatTitle("");
                    showToastSuccess(t("successChat"));
                }
                catch {
                    showToastError("Error", t("errorCreatingChat"))
                }
            }
        }
        catch {
            showToastError("Error", t("errorMessageGeneric"))
        }
        finally {
            setIsCreateChatModalVisible(false);
            setIsLoading(false);
        }
    }

    //Sending a message. Two behaviours: One for first time chatting, which creates a new chat and sends the msg
    //                   The other one, where a chat is already created and it just sends the msg and gets the response
    const handleSendMessage = async () => {
        if (inputText.trim() === '') return;
        setIsLoading(true);
        const newUserMessage: Message = { text: inputText, isUser: true, timestamp: new Date(),};
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInputText('');
        try {
            let receivedMessage: Message;

            if (currentChat === "") {
                receivedMessage = await createChatIfNotExistsAndSendMessage(user?.id, "initialChat", t("contextPrompt"), new Date());
                setCurrentChat(t("initialChat"));
            } else {
                receivedMessage = await createChatIfNotExistsAndSendMessage(userId, currentChat, newUserMessage.text, new Date());
            }
            // means user sent too much messages quickly
            if (receivedMessage.suspicious) {
                const banStatus = await getBanStatus(userId);
                showToastError(t("error"), t("tooManyMessagesQuickly"));
                setBanReason("tooManyMessagesQuickly");
                setIsBanned(true);
                setBanEndTime(banStatus.banEndTime);
            }
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);

        } catch (error: any) {
            //means that user sent an offensive word to the bot
            if (axios.isAxiosError(error) && error.response?.status === 400 && error.response.data === "Inappropriate language detected") {
                const banStatus = await getBanStatus(userId);
                showToastError(t("error"), t("inappropriateLanguage"));
                setBanReason("inappropriateLanguage");
                setIsBanned(true);
                setBanEndTime(banStatus.banEndTime);
            } else {
                showToastError(t("error"), t("errorMessageGeneric"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isBanned) {
        return (
            <View style={styles.banContainer}>
                <Stack.Screen options={{ title: "EcoChatBot" }} />
                <View style={styles.banMessageBox}>
                    <Text style={styles.banTitle}>{t(banReason)}</Text>
                    {banEndTime && (
                        <Text style={styles.banSubtitle}>
                            {t("banEnds")}: {new Date(banEndTime).toUTCString()}
                        </Text>
                    )}
                </View>
            </View>
        );
    }
    else return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: currentChat || "EcoChatBot" }} />
            <View style={styles.optionsContainer}>
                <OptionButton
                    text={t("selectCertificate")}
                    onPress={handleSelectCertificatePress}
                />
                <OptionButton
                    text={t("selectChat")}
                    onPress={handleSelectChatPress}
                />
                <OptionButton
                    text={t("createChat")}
                    onPress={() => setIsCreateChatModalVisible(true)}
                />
            </View>
            <ScrollView
                style={styles.chatContainer}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((message, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            message.isUser ? styles.userMessage : styles.botMessage,
                        ]}
                    >
                        <Text style={message.isUser ? styles.userText : styles.botText}>
                            {message.text}
                        </Text>
                        {message.timestamp && (
                            <Text style={styles.timestamp}>
                                {message.timestamp.toLocaleString()}
                            </Text>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t("chatPlaceholder")}
                    value={inputText}
                    onChangeText={setInputText}
                    editable={!isLoading}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={isLoading || !user}>
                    {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={24} color="white" />
                        )
                    }
                </TouchableOpacity>
            </View>
            <SelectModal
                modalVisible={isCertificateModalVisible}
                setModalVisible={setIsCertificateModalVisible}
                data={certificates}
                renderItem={renderCertificateItem}
            />
            <SelectModal
                modalVisible={isSelectChatModalVisible}
                setModalVisible={setIsSelectChatModalVisible}
                data={userChatNames}
                renderItem={renderChatItem}
            />
            <Modal
                visible={isCreateChatModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsCreateChatModalVisible(false)}
            >

                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContent}>
                        <View style={styles.row}>
                            <Text style={modalStyles.modalTitle}>{t("createChat")}</Text>
                            <Ionicons name={"chatbubble"} size={24} color={colors.forestGreen}/>
                        </View>
                        <TextInput
                            placeholder={t("nameYourChat")}
                            onChangeText={setNewChatTitle}
                        />
                        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
                           <OptionButton
                                text={t("confirm")}
                                onPress={handleChatCreation}
                                additionalStyles={{ backgroundColor: colors.right }}
                           />
                            <OptionButton
                                text={t("cancel")}
                                onPress= {() => {
                                    setIsCreateChatModalVisible(false);
                                    setNewChatTitle("");
                                }}
                                additionalStyles={{ backgroundColor: colors.wrong }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f7f4',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15,
    },
    optionButton: {
        backgroundColor: colors.yellowishGreen,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    activeOption: {
        backgroundColor: colors.forestGreen,
    },
    optionText: {
        color: '#38761d',
        fontSize: 16,
    },
    activeOptionText: {
        color: 'white',
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    messageBubble: {
        maxWidth: '70%',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
    },
    userMessage: {
        backgroundColor: colors.subtleWhite,
        alignSelf: 'flex-end',
        elevation: 5,
    },
    botMessage: {
        backgroundColor: '#e8f5e9',
        alignSelf: 'flex-start',
        elevation: 5,
    },
    userText: {
        color: colors.darkGreen,
    },
    botText: {
        color: colors.darkGreen,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.subtleWhite,
        borderTopWidth: 0.4,
        borderTopColor: colors.grey,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: 'white',
    },
    sendButton: {
        backgroundColor: colors.right,
        borderRadius: 25,
        padding: 12,
    },
    timestamp: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
        gap: 8,
    },
    banContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f7f4",
    },
    banMessageBox: {
        backgroundColor: colors.wrong,
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 20,
    },
    banTitle: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 8,
        textAlign: "center",
    },
    banSubtitle: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
    },
});