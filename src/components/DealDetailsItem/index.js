import React, { useState } from "react";
import "./styles.css";

import CustomModal from "../CustomModal";

import Api from '../../Api';

function DealDetailsItem({details, onAnswer}) {

    const [showModal, setShowModal] = useState(false);

    const [newDealValue, setNewDealValue] = useState(0);
    const [newDealMessage, setNewDealMessage] = useState("");
    const [newDealStartDate, setNewDealStartDate] = useState("");
    const [newDealEndDate, setNewDealEndDate] = useState("");

    const [sendingDealAnswer, setSendingDealAnswer] = useState(false);

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

    async function answerDeal(answer){

        if(sendingDealAnswer) return;
        if(answer === 2 && !validateFields()) return;
        
        let toggleModalWhenFinish = false;
        
        try{
            setSendingDealAnswer(true);
            
            let answerValues = {
                answer: answer,
                value: parseCurrency(newDealValue),
                message: newDealMessage || null,
                starts_at: newDealStartDate || null,
                expires_at: newDealEndDate || null
            };

            let response = await Api.answerDeal(details.id,answerValues);
            if(!response.success) throw new Error("Error answering deal");

            switch(answer){
                case 0:
                    details.status = "recusado";
                break;
                case 1:
                    details.status = "aceito";
                break;
                case 2:
                    details.status = "contraproposta";
                    toggleModalWhenFinish = true;
                break;
                default:
                    console.error("Invalid answer:", answer);
                break;
            }

            details.answered_at = now();
            details.requestingUserShouldAnswer = false;
            if(toggleModalWhenFinish) handleToggleModal();

        }catch(error){
            alert("Algo deu errado, verifique os dados e tente novamente.");
            console.error("Error answering deal:", error);
        }finally{
            setSendingDealAnswer(false);
            onAnswer();
        }
    }

    function now() {
        const data = new Date();
        const day = data.getDate().toString().padStart(2, '0');
        const month = (data.getMonth() + 1).toString().padStart(2, '0');
        const year = data.getFullYear();
        const hours = data.getHours().toString().padStart(2, '0');
        const minutes = data.getMinutes().toString().padStart(2, '0');
    
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    function parseCurrency(value) {
        if (!value) return 0;
    
        const onlyDigits = value.replace(/\D/g, '');
    
        if (!onlyDigits) return 0;
    
        const integer = parseInt(onlyDigits, 10);
        return integer / 100;
    }

    function handleToggleModal(){
        if(sendingDealAnswer && showModal) return;
        setShowModal(!showModal);
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

    return (
        <div className="deal_details_item column-centered">
            <div className="deal_details_item-header row-centered">
                <span className="deal_details_item-header-users">
                    {details.from} 🠖 {details.to}
                </span>
                <span className="deal_details_item-header-date">
                    {details.starts_at} 🠖 {details.expires_at}
                </span>
            </div>
            <p className="deal_details_item-message">
                {details.message}
            </p>
            <div className="deal_details_item-footer">
                <span className="deal_details_item-footer-price">
                {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(details.value)}
                </span>
                {details.requestingUserShouldAnswer && 
                    <div className="deal_details_item-footer-buttons row-centered">
                        <button className="deal_details-button aceitar" title="aceitar proposta" onClick={()=>{answerDeal(1)}}>✔</button>
                        <button className="deal_details-button send-back" title="fazer contraproposta" onClick={handleToggleModal}>↻</button>
                        <button className="deal_details-button recusar" title="recusar proposta" onClick={()=>{answerDeal(0)}}>✖</button>
                    </div>
                }
                {!details.requestingUserShouldAnswer &&
                    <div className="deal_details_answered-container row-centered">
                        {details.answered_at && <span>respondido em: {details.answered_at}</span> }
                        {!details.answered_at && <span>aguardando resposta...</span>}
                        
                        {details.status === "aceito" && <button className="deal_details-button aceitar" title="aceito">✔</button>}
                        {details.status === "contraproposta" && <button className="deal_details-button send-back" title="contraproposta realizada">↻</button>}
                        {details.status === "recusado" && <button className="deal_details-button recusar" title="recusado">✖</button>}
                    </div>
                }
            </div>
            {details.requestingUserShouldAnswer && 
                <CustomModal toggle={handleToggleModal} show={showModal} showCloseButton={false} >
                    <div className="deal_details_modal column-centered default-shadow">
                        <div className="deal_details_modal-header row-centered">
                            <div className="input_block">
                                <span>R$</span>
                                <input type="numeric" placeholder="digite o valor" className="deal_details_modal-input deal_items_shadow" value={newDealValue} onChange={(e) => handleValueChange(e.target.value)}/>
                            </div>
                            <div className="input_block">
                                <span>Início em:</span>
                                <input type="datetime-local" className="deal_details_modal-input deal_items_shadow" value={newDealStartDate} onChange={(e) => setNewDealStartDate(e.target.value)}/>
                            </div>
                            <div className="input_block">
                                <span>Fim em:</span>
                                <input type="datetime-local" className="deal_details_modal-input deal_items_shadow" value={newDealEndDate} onChange={(e) => setNewDealEndDate(e.target.value)}/>
                            </div>
                        </div>
                        <div className="deal_details_modal-message row-centered">
                            <textarea className="deal_details_modal-input deal_items_shadow" placeholder="digite uma mensagem" value={newDealMessage} onChange={(e)=>{setNewDealMessage(e.target.value)}}></textarea>
                        </div>
                        <div className="deal_details_modal-options row-centered">
                            <button className="button_send clickable deal_items_shadow prevent-select" onClick={()=>{answerDeal(2)}}>Enviar</button>
                            <button className="button_cancel clickable deal_items_shadow prevent-select" onClick={handleToggleModal}>Cancelar</button>
                        </div>
                    </div>
                </CustomModal>
            }
        </div>
    )
}

export default DealDetailsItem;