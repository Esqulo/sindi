import React from "react";
import "./styles.css";

// import tempImage from "../../assets/images/icons/star.png";

function Chat(){
    return(
        <div className="chat-container column-centered">
            <div className="chat-content row-centered">
                <div className="chat-people-container column-centered shadow-default">
                    <div className="chat-person-container">
                        {/* <img src={tempImage} alt="user_image" className="chat-person-photo"/> */}
                    </div>
                </div>
                <div className="chat-conversation-container shadow-default">

                </div>
            </div>
        </div>
    );
}

export default Chat;