import React, {useState,useEffect,useRef} from "react";
import "./styles.css";

import CustomImageComponent from "../../components/CustomImgComponent";
import SendIcon from "../../assets/images/icons/send.svg";
import LoadingIcon from "../../components/LoadingIcon";

import noUserImage from "../../assets/images/icons/no-image-profile.png";

import Api from "../../Api";

function Chat(){

    const chatContainerRef = useRef(null);
    const chatListContainerRef = useRef(null);

    const [chatsList,setChatsList] = useState([]);
    const [currentChatData,setCurrentChatData] = useState({});
    const [chatMessages,setChatMessages] = useState([]);
    const [currentUserId,setCurrentUserId] = useState(0);
    const [currentMessage,setCurrentMessage] = useState('');
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const currentChatPage = useRef(0);
    let currentChatDataVar = {};

    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
    
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0
        const year = date.getFullYear();
    
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    async function sendMessage(){
        if (!currentMessage.trim()) return;

        await Api.sendMessage({
            message: currentMessage,
            to: currentChatData.id
        });

        let now = new Date();
        let dateString = `${now.getFullYear()}-${now.getMonth() < 9 ? `0${now.getMonth()+1}` : `${now.getMonth()+1}`}/${now.getDate()} ${now.getHours() < 10 ? `0${now.getHours()}` : now.getHours()}:${now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()}`;
        let sent_at = dateString;
        
        setChatMessages((prev) => [
            ...prev, 
            {
                from: currentUserId,
                message: currentMessage,
                sent_at
            }
        ]);
        
        setCurrentMessage('');
    }

    useEffect(() => {
        if (autoScrollEnabled && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, autoScrollEnabled]);

    function handleMessagesScroll() {
        if (!chatContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

        if (scrollTop < scrollHeight - clientHeight - 200) {
            setAutoScrollEnabled(false);
        } else {
            setAutoScrollEnabled(true);
        }
    }

    async function handleChatListScroll() {
        if (!chatListContainerRef.current) return;
    
        const { scrollTop, scrollHeight, clientHeight } = chatListContainerRef.current;
        
        const scrollPosition = scrollTop + clientHeight;
        const triggerPoint = scrollHeight * 0.8;
    
        if (scrollPosition >= triggerPoint) {
            //currentChatPage is set to -1 after reaching end of scrolling
            //new messages are loaded by loadRecentMessages()
            if (loadingChats || currentChatPage.current === -1) return;
            await loadChatListOnScroll();
        }
    }

    async function loadChatListOnScroll() {
        try {

            setLoadingChats(true);
    
            currentChatPage.current += 1;
    
    
            const apiResponse = await Api.getMyChats(currentChatPage.current);
    
            if (apiResponse.data?.length === 0) {
                currentChatPage.current = -1;
                return;
            }
    
            if (apiResponse.error) return;
    
            setChatsList((prev) => {
                const newChats = (apiResponse.data || []).filter(
                    (newChat) => !prev.some((chat) => chat.id === newChat.id)
                );
                return [...prev, ...newChats];
            });
    
        } catch (err) {

        } finally {
            setLoadingChats(false);
        }
    }

    async function loadRecentMessages() {
        try{
            setLoadingChats(true);

            //Load only first page!
            const apiResponse = await Api.getMyChats(1);

            if (apiResponse.error || apiResponse.data?.length === 0) return;

            setChatsList((prevChats) => {
                const newChats = apiResponse.data || [];
    
                const updatedChats = newChats.map((newChat) => {
                    const existingChat = prevChats.find((chat) => chat.id === newChat.id);
                    return existingChat ? { ...existingChat, ...newChat } : newChat;
                });
    
                const mergedChats = [...prevChats, ...updatedChats].reduce((acc, chat) => {
                    acc.set(chat.id, chat);
                    return acc;
                }, new Map());
    
                return Array.from(mergedChats.values());
            });

        }catch(err){

        }finally{
            setLoadingChats(false);
        }
    }

    async function loadMessagesFromDatabase() {
        let chat_id = currentChatDataVar.id;
        if(!chat_id) return;

        const storedChat = localStorage.getItem(`chat_data_${chat_id}`);
        const storedJson = storedChat ? JSON.parse(storedChat) : { messages: [] };
        
        const lastMessageDate = storedJson.lastMessageDate || null;
       
        const apiResponse = await Api.getChatMessages({
            chat_id,
            begin_date: lastMessageDate
        });

        const newMessages = apiResponse.data || [];

        if (newMessages.length === 0) return;

        setChatMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, ...newMessages];
            
            storeChatMessages(chat_id, updatedMessages);
            
            return updatedMessages;
        });
    }

    async function loadMessagesFromLocalStorage() {
        let chat_id = currentChatDataVar.id;
        if(!chat_id) return;
       
        const storedChat = localStorage.getItem(`chat_data_${chat_id}`);
        let storedJson = storedChat ? JSON.parse(storedChat) : { messages: [] };

        setChatMessages(storedJson.messages);
        
        setCurrentChatData((prev) => ({
            ...prev,
            lastMessageDate: storedJson.lastMessageDate
        }));
    }

    async function setChat(chatData) {
        try{
            if(chatData.id === currentChatData.id) return;
            setChatMessages([]);
            setLoadingMessages(true);

            currentChatDataVar = {
                id: chatData.id,
                title: chatData.title,
                image: chatData.image
            }
            
            setCurrentChatData(currentChatDataVar);

            await loadMessagesFromLocalStorage();
            await loadMessagesFromDatabase();
            
        }catch(err){

        }finally{
            setLoadingMessages(false);
        }
    }
    
    function storeChatMessages(chat_id, messages) {
        if (!messages.length) return;

        const lastMessage = messages[messages.length - 1];
        const lastMessageDate = lastMessage ? lastMessage.sent_at : null;

        let dataToStore = {
            id: chat_id,
            title: currentChatDataVar.title,
            image: currentChatDataVar.image,
            messages: messages,
            lastMessageDate: lastMessageDate
        };

        localStorage.setItem(`chat_data_${chat_id}`, JSON.stringify(dataToStore));
    }

    async function getCurrentUserId(){
        let userId = await Api.getCurrentUserId();
        setCurrentUserId(userId);
    }

    useEffect(() => {

        loadRecentMessages();
        getCurrentUserId();

        const interval = setInterval(() => {
            loadRecentMessages();
            loadMessagesFromDatabase();
        }, 10000);
        return () => clearInterval(interval);

    }, []);

    return(
        <div className="chat-container column-centered">
            <div className="chat-content row-centered">
                <div className="chat-people-container column-centered shadow-default custom-scroll" ref={chatListContainerRef} onScroll={handleChatListScroll}>
                    {chatsList.map((chat,index) => (
                        <div className={`chat-person-container row-centered prevent-select ${chat.id === currentChatData.id ? 'selected' : ''}`} key={String(chat.id)} onClick={ () => setChat(chat) }>
                            <CustomImageComponent img={chat.image || noUserImage} width={"80px"} borderRadius={"50%"} style={{border:'2px solid #FFF', backgroundSize: '120%'}}/>
                            <div className="chat-person-info">
                                <span className="chat-person-name">{chat.title}</span>
                                <span className="chat-person-last-message" title={chat.last_message}>{chat.last_message}</span>
                            </div>
                        </div>
                    ))}
                    {loadingChats &&
                        <LoadingIcon color="#000"/>
                    }
                </div>
                <div className="chat-conversation-container shadow-default">
                    {currentChatData.id && <>
                        <div className="chat-conversation-header row-centered">
                            <CustomImageComponent img={currentChatData.image || noUserImage} width={"60px"} height={"60px"} borderRadius={"50%"} style={{maxHeight: "100%"}}/>
                            <span className="chat-conversation-header-title">{currentChatData.title}</span>
                        </div>
                        <div className="chat-conversation-content custom-scroll" ref={chatContainerRef} onScroll={handleMessagesScroll}>
                            {chatMessages.map((message,index) => (
                                <div className={`chat-message-container ${message.from === currentUserId ? 'mesage-right' : 'mesage-left'}`} key={String(index)}>
                                    <div className="chat-message">{message.message}</div>
                                    <span className={`chat-message-time ${message.from === currentUserId ? 'message-time-right' : 'message-time-left'}`} >{formatDateTime(message.sent_at)}</span>
                                </div>
                            ))}
                            {loadingMessages &&
                                <div className="loading-messages-container"><LoadingIcon color="#000"/></div>
                            }
                        </div>
                        <div className="chat-conversation-input row-centered">
                            <input type="text" placeholder="Digite uma mensagem" value={currentMessage} onChange={(event)=>{setCurrentMessage(event.target.value)}} onKeyDown={handleKeyDown}/>
                            <img src={SendIcon} alt="enviar" onClick={sendMessage} className="chat-conversation-send-icon"/>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    );
}

export default Chat;