import React, { useState } from "react";
import "./styles.css";

import noUserImage from "../../../assets/images/icons/no-image-profile.png";
import star from '../../../assets/images/profile/star.png';
import badge from '../../../assets/images/profile/badge.png';

import CustomModal from "../../CustomModal";

import Api from "../../../Api";

function DetailComponent({ userData }) {

	const [showDealModal, setShowDealModal] = useState(false);
	const [sendingDeal, setSendingDeal] = useState(false);

	const [newDealValue, setNewDealValue] = useState(0);
	const [newDealMessage, setNewDealMessage] = useState("");
	const [newDealStartDate, setNewDealStartDate] = useState("");
	const [newDealEndDate, setNewDealEndDate] = useState("");

	function handleToggleModal(){
        if(sendingDeal && showDealModal) return;
        setShowDealModal(!showDealModal);
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

	async function createDeal(){

        if(sendingDeal) return;
        if(!validateFields()) return;

        try{
            setSendingDeal(true);
            
            let response = await Api.createDeal({
				to: userData.id,
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
			handleToggleModal();
			setNewDealValue(0);
			setNewDealMessage("");
			setNewDealStartDate("");
			setNewDealEndDate("");
            setSendingDeal(false);
        }
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
		<div className='profile-detail-container'>

			<div className='profile-detail-avatar'>
				<img className='profile-details-avatar-image' src={userData.avatar || noUserImage} alt="user-picture" />
				{userData.highlight && 
					<img className="profile-detail-avatar-highlight" src={badge} alt="selo" />
				}
			</div>

			<div className='profile-detail-userdata'>

				<div className='row-centered'>
					<span className='profile-detail-userdata-name'>
						{userData.name}
					</span>
					<div className='profile-detail-options row-centered'>
						<span className="material-symbols-outlined" title='Enviar mensagem' >
							chat
						</span>
						<span className="material-symbols-outlined" title='Fazer uma proposta' onClick={handleToggleModal}>
							handshake
						</span>
					</div>
				</div>

				<div className='profile-detail-userdata-rating row-centered'>
					<img src={star} alt="Estrela" /> {Number(userData?.rating || 0).toFixed(2)} ({userData.reviews || 0})
				</div>
				
				{/* future feature
					<div className='profile-detail-userdata-skills'>
						<ul>
							<li>8 anos como síndico profissional</li>
							<li>Formando em Administração</li>
							<li>47 anos • 15 km de você</li>
						</ul>
					</div> 
				*/}

				<span className='profile-detail-bio'>
					{userData.bio}
				</span>

			</div>
			<CustomModal toggle={handleToggleModal} show={showDealModal} showCloseButton={false} >
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
						<button className="button_send clickable deal_items_shadow prevent-select" onClick={()=>{createDeal()}}>Enviar</button>
						<button className="button_cancel clickable deal_items_shadow prevent-select" onClick={handleToggleModal}>Cancelar</button>
					</div>
				</div>
			</CustomModal>
		</div>
	);
}

export default DetailComponent;
