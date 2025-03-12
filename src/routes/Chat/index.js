import React, {useState,useEffect,useRef} from "react";
import "./styles.css";

import CustomImageComponent from "../../components/CustomImgComponent";
import SendIcon from "../../assets/images/icons/send.svg";

function Chat(){

    const chatContainerRef = useRef(null);

    const [chats,setChats] = useState([]);
    const [chatMessages,setChatMessages] = useState([]);
    const [currentUserId,setCurrentUserId] = useState(0);
    const [currentMessage,setCurrentMessage] = useState('');
    const [currentChatData,setCurrentChatData] = useState({});
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    function sendMessage(){
        let now = new Date();
        let sent_at = `${now.getDate()}/${now.getMonth() + 1 < 10 ? `0${now.getMonth()+1}` : `${now.getMonth()+1}` }/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
        console.log()
        if (!currentMessage.trim()) return;
        setChatMessages((prev) => [
            ...prev, 
            { from: currentUserId, message: currentMessage, sent_at }
        ]);
        setCurrentMessage('');
    }

    useEffect(() => {
        if (autoScrollEnabled && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, autoScrollEnabled]);

    function handleScroll() {
        if (!chatContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

        if (scrollTop < scrollHeight - clientHeight - 200) {
            setAutoScrollEnabled(false);
        } else {
            setAutoScrollEnabled(true);
        }
    }

    useEffect(() => {
        setCurrentUserId(2);

        setChats([
            {
                "id": 1,
                "name": "Juan Elias da Cunha",
                "last_message": "Às 18:00 está bom para você?"
            },
            {
                "id": 2,
                "name": "Ana Beatriz Vieira da Silva",
                "last_message": "Oi, boa tarde!",
                "avatar": "https://picsum.photos/200/200"
            },
            {
                "id": 3,
                "name": "Silvania Aparecida Elias",
                "last_message": "Poderia me informar o valor?",
                "avatar": "https://picsum.photos/400/400"
            },
            {
                "id": 4,
                "name": "Roberta Sara Elias da Cunha",
                "last_message": "Entrarei em contato, assim que possível.",
                "avatar": "https://picsum.photos/500/500"
            },
            {
                "id": 5,
                "name": "Rian Elias da Cunha",
                "last_message": "perfeito!",
                "avatar": "https://picsum.photos/350/350"
            },
            {
                "id": 6,
                "name": "Juan Elias da Cunha",
                "last_message": "Às 18:00 está bom para você?"
            },
            {
                "id": 7,
                "name": "Ana Beatriz Vieira da Silva",
                "last_message": "Oi, boa tarde!",
                "avatar": "https://picsum.photos/200/200"
            },
            {
                "id": 8,
                "name": "Silvania Aparecida Elias",
                "last_message": "Poderia me informar o valor?",
                "avatar": "https://picsum.photos/400/400"
            },
            {
                "id": 9,
                "name": "Roberta Sara Elias da Cunha",
                "last_message": "Entrarei em contato, assim que possível.",
                "avatar": "https://picsum.photos/500/500"
            },
            {
                "id": 10,
                "name": "Rian Elias da Cunha",
                "last_message": "perfeito!",
                "avatar": "https://picsum.photos/350/350"
            },
        ]);

        setChatMessages([
            {
                "from": 1,
                "message": "Oi, boa tarde!",
                "sent_at": "11/03/2025 21:48"
            },
            {
                "from": 2,
                "message": "Boa tarde!",
                "sent_at": "11/03/2025 21:48"
            },
            {
                "from": 1,
                "message": "Gostaria de realizar um orçamento.",
                "sent_at": "11/03/2025 21:48"
            },
            {
                "from": 2,
                "message": "Que ótimo! Tem disponibilidade para um reunião?",
                "sent_at": "11/03/2025 21:48"
            },
            {
                "from": 1,
                "message": "Podemos marcar amanhã às 18:00?",
                "sent_at": "11/03/2025 21:48"
            },
            {
                "from": 2,
                "message": "Perfeito!",
                "sent_at": "11/03/2025 21:48"
            },
            {
                "from": 1,
                "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sagittis, eros non dapibus hendrerit, orci lectus auctor est, eu pulvinar elit ante ac nisi. Nunc viverra odio in euismod convallis. Suspendisse venenatis lobortis sapien. Integer elementum vel quam sed elementum. Fusce nec lacinia ex. Fusce dictum dictum lacus, eget consectetur nunc suscipit ut. Sed ac risus at risus volutpat iaculis. Vivamus egestas nisi nec vulputate suscipit. Cras eget finibus justo. Suspendisse ut sagittis purus.",
                "sent_at": "11/03/2025 21:48"
            },
            {
                "from": 2,
                "message": "Donec facilisis ante in mauris gravida, vitae vestibulum enim vehicula. Integer dignissim dui id mollis placerat. Donec vitae mauris nec nibh dictum viverra nec ac arcu. Nullam a ligula et nibh dignissim malesuada. Suspendisse interdum finibus neque vitae interdum. Vestibulum tristique augue hendrerit, maximus nisl eu, commodo velit. Cras auctor consectetur eleifend. Donec commodo eros quis posuere tincidunt. Mauris facilisis pulvinar dolor vitae consectetur. Etiam placerat est sit amet nulla commodo, in blandit ligula rutrum.",
                "sent_at": "11/03/2025 21:48"
            },
        ]);

        setCurrentChatData({
            image: "https://picsum.photos/300/300",
            title: "Ana Beatriz Vieira da Silva"
        });

    }, []);

    return(
        <div className="chat-container column-centered">
            <div className="chat-content row-centered">
                <div className="chat-people-container column-centered shadow-default custom-scroll">
                    {chats.map((chat,index) => (
                        <div className="chat-person-container row-centered" key={String(chat.id)}>
                            <CustomImageComponent img={chat.avatar} width={"80px"} borderRadius={"50%"} />
                            <div className="chat-person-info">
                                <span className="chat-person-name">{chat.name}</span>
                                <span className="chat-person-last-message" title={chat.last_message}>{chat.last_message}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-conversation-container shadow-default">
                    <div className="chat-conversation-header row-centered">
                        <CustomImageComponent img={currentChatData.image} width={"60px"} height={"60px"} borderRadius={"50%"} style={{maxHeight: "100%"}}/>
                        <span className="chat-conversation-header-title">{currentChatData.title}</span>
                    </div>
                    <div className="chat-conversation-content custom-scroll" ref={chatContainerRef} onScroll={handleScroll}>
                        {chatMessages.map((message,index) => (
                            <div className={`chat-message-container ${message.from === currentUserId ? 'mesage-right' : 'mesage-left'}`} key={String(index)}>
                                <div className="chat-message">{message.message}</div>
                                <span className={`chat-message-time ${message.from === currentUserId ? 'message-time-right' : 'message-time-left'}`} >{message.sent_at}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chat-conversation-input row-centered">
                        <input type="text" placeholder="Digite uma mensagem" value={currentMessage} onChange={(event)=>{setCurrentMessage(event.target.value)}} onKeyDown={handleKeyDown}/>
                        <img src={SendIcon} alt="enviar" onClick={sendMessage} className="chat-conversation-send-icon"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;