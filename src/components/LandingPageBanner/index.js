import React from "react";
import { useState } from "react";
import "./styles.css";
import MaskedInput from "react-input-mask";

function LandingPageBanner(){

    const [userName,setUserName] = useState('');
    const [userEmail,setUserEmail] = useState('');
    const [userPhone,setUserPhone] = useState('');
    const [accountType, setAccountType] = useState(null);

    const [showInputs,setShowInputs] = useState(true);

    const [allowSend,setAllowSend] = useState(true);
    const [sendButtonText,setSendButtonText] = useState('Enviar');

    const [showError,setShowError] = useState(false);
    const [errorMessage,setErrorMessage] = useState('');

    const handleRadioChange = (event) => {
        setAccountType(event.target.value);
    };

    const handlePhoneInputChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        setUserPhone(rawValue);
    };

    async function send(){
        if(!allowSend) return;
        try{
            const resp = await fetch("/services/api/newsletter",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": userName,
                    "email": userEmail,
                    "phone": userPhone,
                    "type": accountType
                })
            });

            if(resp.status !== 200){
                throw new Error ("Algo deu errado, verifique as informações e tente novamente.");
            }

            setShowInputs(false);
            setAllowSend(false);
            setSendButtonText('Enviado!');

        }catch(err){
            
            setErrorMessage(err.message);
            setShowError(true);

            setTimeout(()=>{
                setShowError(false);
            },5000)
        }
    }


    return(
        <div className="lpbanner-container">
            <div className="lpbanner-content">
                <div className="lpbanner-textarea">
                    <span className="lpbanner-textarea-uppertext">Com a Sindi, conectar síndicos e clientes ficou <b>muito</b> mais fácil</span>
                    <span className="lpbanner-textarea-bottomtext">Seja o primeiro a saber de todas as novidades! Garanta acesso antecipado à plataforma, receba dicas de como alavancar sua carreira e aproveite 1 mês de acesso premium grátis. Deixe seu e-mail e não perca nenhuma oportunidade</span>
                </div>
                <div className="lpbanner-formarea">
                    {showInputs && (
                        <>
                            <input id="name_input" type="text" className="lpbanner-form-input" placeholder="Nome" onChange={(e) => setUserName(e.target.value)}/>
                            <input id="email_input" type="email" className="lpbanner-form-input" placeholder="Digite seu melhor e-mail" onChange={(e) => setUserEmail(e.target.value)}/>
                            <MaskedInput id="phone_input" className="lpbanner-form-input" placeholder="DDD + Whatsapp" mask="(99) 99999-9999" onChange={handlePhoneInputChange}/>
                            <div className="lpbanner-form-radio-area">
                                    {/* TO DO: Transform this into a component */}
                                <label className="lpbanner-radio-input" htmlFor="lpbanner-customer_input">
                                    <input id="lpbanner-customer_input" name="account_type" type="radio" value="0" onChange={handleRadioChange}/>
                                    <span className="lpbanner-radio-checkmark"></span>
                                    <span className="lpbanner-radio-text">Condomino</span>
                                </label>
                                <label className="lpbanner-radio-input" htmlFor="lpbanner-professional_input">
                                    <input id="lpbanner-professional_input" name="account_type" type="radio" value="1" onChange={handleRadioChange}/>
                                    <span className="lpbanner-radio-checkmark"></span>
                                    <span className="lpbanner-radio-text">Síndico</span>
                                </label>
                            </div>

                        </>
                    )}
                    <button id="send_button" className="lpbanner-form-button" onClick={send}>{sendButtonText}</button>
                    {showError && (<span className="errorMessage">{errorMessage}</span>)}
                </div>
            </div>
        </div>
    );
}

export default LandingPageBanner;