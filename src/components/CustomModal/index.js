import React from "react";
import "./styles.css";

function CustomModal({ show, toggle, children, onClose, showBrackground = true, showCloseButton = true }) {
    
    function handleClose(){
        try{
            onClose();
        }catch(e){
            console.error("Error in onClose function:", e);
        }finally{
            toggle();
        }
    }

    return (
        <>
        {show &&
            <div className={`custom-modal-container ${showBrackground ? "show-background" : ""}`} onClick={onClose}>
                <div className="custom-modal-content">
                    
                    {children}

                    {showCloseButton &&
                        <div className="custom-modal-close-button clickable" onClick={handleClose}>
                            <div className="close-button-x" style={{transform: 'rotate(45deg)'}}></div>
                            <div className="close-button-x" style={{transform: 'rotate(-45deg)'}}></div>
                        </div>
                    }
                </div>
            </div>
        }
        </>
    );
}

export default CustomModal;