import React, { useState, useEffect } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

import noUserImage from "../../../assets/images/icons/no-image-profile.png";
import star from '../../../assets/images/profile/star.png';
import badge from '../../../assets/images/profile/badge.png';

import CustomModal from "../../CustomModal";
import StarsInput from '../../StarsInput';

import Api from "../../../Api";

// Sim, este código precisa ser refatorado...
//está horrível, mas precisa ser entregue rápido...

function DetailComponent({ userData }) {

	const navigate = useNavigate();

	const [showDealModal, setShowDealModal] = useState(false);
	const [showChatModal, setShowChatModal] = useState(false);
	const [showCommentsModal, setShowCommentsModal] = useState(false);
	const [showNewServiceModal, setShowNewServiceModal] = useState(false);
	const [sendingDeal, setSendingDeal] = useState(false);
	const [sendingMessage, setSendingMessage] = useState(false);
	const [sendingComment, setSendingComment] = useState(false);
	const [sendingNewService, setSendingNewService] = useState(false);
	const [messageSentSuccess, setMessageSentSuccess] = useState(false);

	const [newDealValue, setNewDealValue] = useState(0);
	const [newDealMessage, setNewDealMessage] = useState("");
	const [newDealStartDate, setNewDealStartDate] = useState("");
	const [newDealEndDate, setNewDealEndDate] = useState("");
	const [chatMessage, setChatMessage] = useState("");
	const [commentText, setCommentText] = useState("");
	const [newServiceTitle, setNewServiceTitle] = useState("");
	const [newServicePrice, setNewServicePrice] = useState("");
	const [newServiceDescription, setNewServiceDescription] = useState("");
	const [rating, setRating] = useState(0);

	function handleToggleDealsModal(){
        if(sendingDeal && showDealModal) return;
        setShowDealModal(!showDealModal);
    }

	function handleToggleServicesModal(){
        // if(sendingDeal && showDealModal) return;
        setShowNewServiceModal(!showNewServiceModal);
    }

	function handleToggleChatModal(){
        if(sendingMessage && showChatModal) return;
        setShowChatModal(!showChatModal);
    }

	function handleToggleCommentsModal(){
        if(sendingComment && showCommentsModal) return;
        setShowCommentsModal(!showCommentsModal);
    }

	async function sendMessage(){
		if(sendingMessage) return;
		try{
			setSendingMessage(true);
			if(!chatMessage.trim()) throw new Error('mensagem em branco');

			let apiResponse = await Api.createChat({
				users: [userData.id],
				message: chatMessage
			});

			if (apiResponse !== true) throw new Error("algo deu errado ao enviar a mensagem");
			
			setChatMessage("");
			setMessageSentSuccess(true);
			alert('mensagem enviada com sucesso');

		}catch(err){

			alert(err.message);

		}finally{
			setSendingMessage(false);
			setShowChatModal(false);
		}
		
	}

	async function sendComment(){
		if(sendingComment) return;
		try{
			setSendingComment(true);
			if(!commentText.trim()) throw new Error('mensagem em branco');

			let apiResponse = await Api.avaliateUser({
				to: userData.id,
				message: commentText,
				stars: rating
			});

			if (apiResponse !== true) throw new Error("algo deu errado ao enviar a avaliação");
			
			setChatMessage("");
			setMessageSentSuccess(true);
			alert('avaliação enviada com sucesso');

		}catch(err){

			alert(err.message);

		}finally{
			setSendingComment(false);
			handleToggleCommentsModal();
		}
		
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
			handleToggleDealsModal();
			setNewDealValue(0);
			setNewDealMessage("");
			setNewDealStartDate("");
			setNewDealEndDate("");
            setSendingDeal(false);
        }
    }

	async function createService(){

		console.log('newServiceTitle',newServiceTitle);
		console.log('newServicePrice',newServicePrice);
		console.log('newServiceDescription',newServiceDescription);

        if(sendingNewService) return;
		
        try{
            setSendingNewService(true);

			if(!newServiceTitle || !newServicePrice || !newServiceDescription){
				alert("Preencha todos os campos!");
				return;
			}
            
            let response = await Api.newService({
				title: newServiceTitle,
                price: parseCurrency(newServicePrice),
                description: newServiceDescription
            });

            if(response !== true) throw new Error("Error creating deal");

        }catch(error){
            alert("Algo deu errado, verifique os dados e tente novamente.");
            console.error("Error creating service:", error);
        }finally{
			alert("criado com sucesso");
			handleToggleServicesModal();
			setNewServiceTitle("");
			setNewServicePrice(0);
			setNewServiceDescription("");
            setSendingNewService(false);
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

	function handleNewServicePrice(value) {
		const numeric = value.replace(/\D/g, "");

		if (!numeric) {
			setNewServicePrice("");
			return;
		}

		const integer = numeric.slice(0, -2) || "0";
		const decimal = numeric.slice(-2);

		const formatted = parseInt(integer).toLocaleString("pt-BR") + "," + decimal;

		setNewServicePrice(formatted);
	}

	function handleDealsClick(){
		userData.userIsOwner ? navigate("/deals") : handleToggleDealsModal();
	}

	function handleChatClick(){
		userData.userIsOwner || messageSentSuccess ? navigate("/chat") : handleToggleChatModal();
	}

	useEffect(()=>{
		setShowDealModal(false);
		setShowChatModal(false);
		setSendingDeal(false);
		setSendingMessage(false);
		setMessageSentSuccess(false);
		setShowNewServiceModal(false);
		setNewDealValue(0);
		setNewDealMessage("");
		setNewDealStartDate("");
		setNewDealEndDate("");
		setChatMessage("");
	},[userData]);

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
						<span className="material-symbols-outlined" title={ userData.userIsOwner ? 'Ver minhas mensagens' : 'Enviar mensagem'} onClick={handleChatClick}>
							chat
						</span>
						<span className="material-symbols-outlined" title={ userData.userIsOwner ? 'Ver minhas propostas' : 'Fazer uma proposta' } onClick={handleDealsClick}>
							handshake
						</span>
						{ !userData.userIsOwner &&
						<span className="material-symbols-outlined" title="Fazer comentário" onClick={handleToggleCommentsModal}>
							thumbs_up_down
						</span>
						}
						{ (userData.userIsOwner && userData.type === 1) &&
						<span className="material-symbols-outlined" title="Cadastrar serviços" onClick={handleToggleServicesModal}>
							enterprise
						</span>
						}
						{ userData.userIsOwner &&
						<span className="material-symbols-outlined" title="Configurações" onClick={() => {navigate("/settings")}}>
							settings
						</span>
						}
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
			<CustomModal toggle={handleToggleDealsModal} show={showDealModal} showCloseButton={false} >
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
						<button className="button_cancel clickable deal_items_shadow prevent-select" onClick={handleToggleDealsModal}>Cancelar</button>
					</div>
				</div>
			</CustomModal>
			<CustomModal toggle={handleToggleChatModal} show={showChatModal} showCloseButton={false} >
				<div className="deal_details_modal column-centered default-shadow">
					<div className="deal_details_modal-header row-centered">
						<span className="chat-modal-header">Enviar mensagem</span>
					</div>
					<div className="deal_details_modal-message row-centered">
						<textarea className="deal_details_modal-input deal_items_shadow" placeholder="digite uma mensagem" value={chatMessage} onChange={(e)=>{setChatMessage(e.target.value)}}></textarea>
					</div>
					<div className="deal_details_modal-options row-centered">
						<button className="button_send clickable deal_items_shadow prevent-select" onClick={()=>{sendMessage()}}>Enviar</button>
						<button className="button_cancel clickable deal_items_shadow prevent-select" onClick={handleToggleChatModal}>Cancelar</button>
					</div>
				</div>
			</CustomModal>
			<CustomModal toggle={handleToggleCommentsModal} show={showCommentsModal} showCloseButton={false} >
				<div className="comments_details_modal column-centered default-shadow">
					<div className="deal_details_modal-header row-centered">
						<span className="chat-modal-header">Fazer avaliação</span>
					</div>
					<div className="comment_details_modal-stars row-centered">
						Selecione a nota:
						<StarsInput value={rating} onChange={setRating} />
					</div>
					<div className="deal_details_modal-message row-centered">
						<textarea className="deal_details_modal-input deal_items_shadow" placeholder="digite uma mensagem" value={commentText} onChange={(e)=>{setCommentText(e.target.value)}}></textarea>
					</div>
					<div className="deal_details_modal-options row-centered">
						<button className="button_send clickable deal_items_shadow prevent-select" onClick={()=>{sendComment()}}>Enviar</button>
						<button className="button_cancel clickable deal_items_shadow prevent-select" onClick={handleToggleCommentsModal}>Cancelar</button>
					</div>
				</div>
			</CustomModal>
			<CustomModal toggle={handleToggleServicesModal} show={showNewServiceModal} showCloseButton={false} >
				<div className="deal_details_modal column-centered default-shadow">
					<div className="deal_details_modal-header row-centered" style={{justifyContent: "normal" }}>
						<div className="input_block" >
							<span>Título</span>
							<input type="text" placeholder="digite o título" className="deal_details_modal-input deal_items_shadow" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} style={{width: "400px" }}/>
						</div>
						<div className="input_block" style={{marginLeft: "20px" }}>
							<span>R$</span>
							<input type="numeric" placeholder="digite o valor" className="deal_details_modal-input deal_items_shadow" value={newServicePrice} onChange={(e) => handleNewServicePrice(e.target.value)} style={{width: "190px" }}/>
						</div>
					</div>
					<div className="deal_details_modal-message row-centered">
						<textarea className="deal_details_modal-input deal_items_shadow" placeholder="digite uma mensagem" value={newServiceDescription} onChange={(e)=>{setNewServiceDescription(e.target.value)}}></textarea>
					</div>
					<div className="deal_details_modal-options row-centered">
						<button className="button_send clickable deal_items_shadow prevent-select" onClick={createService}>Enviar</button>
						<button className="button_cancel clickable deal_items_shadow prevent-select" onClick={handleToggleServicesModal}>Cancelar</button>
					</div>
				</div>
			</CustomModal>
			
		</div>
	);
}

export default DetailComponent;
