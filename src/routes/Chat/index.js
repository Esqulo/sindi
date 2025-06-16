import React, {useState,useEffect,useRef,useCallback} from "react";
import "./styles.css";

import CustomImageComponent from "../../components/CustomImgComponent";
import SendIcon from "../../assets/images/icons/send.svg";
import LoadingIcon from "../../components/LoadingIcon";
import CustomModal from "../../components/CustomModal";

import noUserImage from "../../assets/images/icons/no-image-profile.png";

import Api from "../../Api";

function Chat(){

    const chatContainerRef = useRef(null);
    const chatListContainerRef = useRef(null);
    const loadingPreviousMessages = useRef(false);

    const [chatsList,setChatsList] = useState([]);
    const [currentChatData,setCurrentChatData] = useState({});
    const [chatMessages,setChatMessages] = useState([]);
    const [currentUserId,setCurrentUserId] = useState(0);
    const [currentMessage,setCurrentMessage] = useState('');
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

    const [sendingDeal, setSendingDeal] = useState(false);
    const [showDealModal, setShowDealModal] = useState(false);
    const [newDealValue, setNewDealValue] = useState(0);
    const [newDealMessage, setNewDealMessage] = useState("");
    const [newDealStartDate, setNewDealStartDate] = useState("");
    const [newDealEndDate, setNewDealEndDate] = useState("");

    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    const [showDealsButton, setShowDealsButton] = useState(false);

    const currentChatPage = useRef(0);

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
        if (event.key === "Enter") sendMessage();
    }

    async function sendMessage(){
        if (!currentMessage.trim()) return;

        await Api.sendMessage({
            message: currentMessage,
            to: currentChatData.id
        });
        
        setCurrentMessage('');

        await loadMessagesFromDatabase();
    }

    function handleValueChange(value) {
        const numeric = value.replace(/\D/g, '');

        if (!numeric) {
          setNewDealValue('');
          return;
        }

        const integer = numeric.slice(0, -2) || '0';
        const decimal = numeric.slice(-2);

        const formatted = parseInt(integer).toLocaleString('pt-BR') + ',' + decimal;

        setNewDealValue(formatted);
    }

    function validateFields(){
        try{
            
            const start = new Date(newDealStartDate);
            const end = new Date(newDealEndDate);
            const current = new Date();
    
            if (isNaN(start.getTime()) || start < current) throw new Error("Data de início inválida");
            if (isNaN(end.getTime()) || end < current) throw new Error("Data de fim inválida");
            if (start > end) throw new Error("Data de início maior que data de fim");

            if(parseFloat(newDealValue) <= 0) throw new Error("Valor inválido");
            if(!newDealMessage || newDealMessage.length < 5) throw new Error("Mensagem muito curta.");

            return true;

        }catch(error){
            alert(error.message);
            return false;
        }
    }

    function parseCurrency(value) {
        if (!value) return 0;

        const onlyDigits = value.replace(/\D/g, '');

        if (!onlyDigits) return 0;

        const integer = parseInt(onlyDigits, 10);
        return integer / 100;
    }

    function handleToggleDealsModal(){
        if(sendingDeal && showDealModal) return;
        setShowDealModal(!showDealModal);
    }

    async function createDeal(){
        if(sendingDeal) return;
        if(!validateFields()) return;

        try{
            setSendingDeal(true);
            
            let response = await Api.createDeal({
                to: currentChatData.chatWithUser,
                value: parseCurrency(newDealValue),
                message: newDealMessage || null,
                starts_at: newDealStartDate || null,
                expires_at: newDealEndDate || null
            });

            if(response !== true) throw new Error("Error creating deal");

        }catch(error){
            alert("Algo deu errado, verifique os dados e tente novamente.");
            console.error("Error answering deal:", error);
        }finally{
            alert("enviado com sucesso");
            handleToggleDealsModal();
            setNewDealValue(0);
            setNewDealMessage("");
            setNewDealStartDate("");
            setNewDealEndDate("");
            setSendingDeal(false);
        }
    }

    useEffect(() => {
        if (autoScrollEnabled && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, autoScrollEnabled]);

    async function handleMessagesScroll() {
        if (!chatContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

        if (scrollTop < scrollHeight - clientHeight - 200) {
            setAutoScrollEnabled(false);
        } else {
            setAutoScrollEnabled(true);
        }

        if(scrollTop <= 10){
            const messagesBefore = chatMessages[0].sent_at;
            await loadPreviousMessages(messagesBefore);
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

    const loadRecentMessages = useCallback(async () => {
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
    }, []);

    const storeChatLastCheckpoint = useCallback(async (chat_id) => {
        let now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const dateString = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        localStorage.setItem(`chat_data_${chat_id}`, dateString);
    }, []);

    async function setChat(chatData) {
        if(chatData.id === currentChatData.id) return;
        
        setChatMessages([]);

        let chatObject = {
            id: chatData.id,
            title: chatData.title,
            image: chatData.image
        }

        if(chatData.type === 0){
            setShowDealsButton(true);
            chatObject.chatWithUser = chatData.user_id;
        }

        setCurrentChatData(chatObject);
    }

    const loadPreviousMessages = useCallback(async (messagesBefore) => {
        if(loadingPreviousMessages.current) return;
        try{
            loadingPreviousMessages.current = true;

            let chat_id = currentChatData.id;
            if(!chat_id) return;

            const apiResponse = await Api.getChatMessages({
                end_date: messagesBefore,
                chat_id
            });

            const newMessages = apiResponse.data || [];

            await storeChatLastCheckpoint(chat_id);

            setChatMessages((prev) => [...newMessages, ...prev]);
        }catch(err){
            console.err(err)
        }finally{
            loadingPreviousMessages.current = false;
        }
    },[currentChatData, storeChatLastCheckpoint]);

    const loadMessagesFromDatabase = useCallback(async () => {

        let chat_id = currentChatData.id;
        if(!chat_id) return;

        const storedCheckpoint = localStorage.getItem(`chat_data_${chat_id}`);

        const apiResponse = await Api.getChatMessages({
            chat_id,
            begin_date: storedCheckpoint
        });

        const newMessages = apiResponse.data || [];

        await storeChatLastCheckpoint(chat_id);

        setChatMessages((prev) => [...prev, ...newMessages]);

    }, [currentChatData,storeChatLastCheckpoint]);

    useEffect(() =>{

        if(!currentChatData.id || loadingMessages) return;

        async function loadMessages() {
            let now = new Date();
            const pad = (n) => n.toString().padStart(2, '0');
            const dateString = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

            await loadPreviousMessages(dateString);
            await loadMessagesFromDatabase();
        }

        try{
            setLoadingMessages(true);
            loadMessages();
        }catch(err){
            console.error('failed to load messages');
        }finally{
            setLoadingMessages(false);
        }

        // eslint-disable-next-line
    }, [currentChatData.id]);

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

    }, [loadMessagesFromDatabase, loadRecentMessages]);

    return(
        <div className="chat-container column-centered">
            <h1 className="title">Chat</h1>
            <div className="chat-content row-centered">
                <div className="chat-people-container column-centered shadow-default custom-scroll" ref={chatListContainerRef} onScroll={handleChatListScroll}>
                    {chatsList.map((chat,index) => (
                        <div className={`chat-person-container row-centered prevent-select ${chat.id === currentChatData.id ? 'selected' : ''}`} key={String(chat.id)} onClick={ () => setChat(chat) }>
                            <CustomImageComponent img={chat.image || noUserImage} width={"80px"} borderRadius={"50%"} style={{border:'2px solid #FFF' }}/>
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
                            <div className="chat-conversation-input-options">
                                <img src={SendIcon} alt="enviar" onClick={sendMessage} className="chat-conversation-send-icon" title="Enviar"/>
                                {showDealsButton && <span onClick={handleToggleDealsModal} className="material-symbols-outlined chat-conversation-send-icon" title="Realizar proposta">handshake</span>}
                            </div>
                        </div>
                    </>}
                </div>
            </div>
            <CustomModal toggle={handleToggleDealsModal} show={showDealModal} showCloseButton={false} >
				<div className="deal_details_modal column-centered default-shadow">
					<div className="deal_details_modal-header row-centered">
						<div className="input_block">
							<span>R$</span>
							<input type="numeric" placeholder="digite o valor" className="deal_details_modal-input deal_items_shadow" value={newDealValue} onChange={(e) => handleValueChange(e.target.value)} style={{width: "120px"}}/>
						</div>
						<div className="input_block small">
							<span>Início do mandato previsto em:</span>
							<input type="datetime-local" className="deal_details_modal-input deal_items_shadow" value={newDealStartDate} onChange={(e) => setNewDealStartDate(e.target.value)}/>
						</div>
						<div className="input_block small">
							<span>Término do mandato previsto em:</span>
							<input type="datetime-local" className="deal_details_modal-input deal_items_shadow" value={newDealEndDate} onChange={(e) => setNewDealEndDate(e.target.value)}/>
						</div>
					</div>
					<div className="deal_details_modal-message row-centered">
						<textarea className="deal_details_modal-input deal_items_shadow" placeholder="digite uma mensagem" value={newDealMessage} onChange={(e)=>{setNewDealMessage(e.target.value)}}></textarea>
					</div>
					<div className="deal_details_modal-options row-centered">
						<button className="button_send clickable deal_items_shadow prevent-select" onClick={()=>{createDeal()}}>Enviar</button>
						<button className="button_cancel clickable deal_items_shadow prevent-select" onClick={handleToggleDealsModal}>Cancelar</button>
					</div>
				</div>
			</CustomModal>
        </div>
    );
}

export default Chat;