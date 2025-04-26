import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

import LoadingIcon from "../../components/LoadingIcon";
import CustomTextInput from "../../components/CustomTextInput";

import Api from "../../Api";

function ForgotPassword() {
	const formRef = useRef(null);

	const [error, setError] = useState("");
	const [email, setEmail] = useState("");
	const [sending, setSending] = useState(false);

	const navigate = useNavigate();

	async function validateFields() {

		setError("");

		const requiredFields = formRef.current.querySelectorAll("input[required]");

		for (let input of requiredFields) {
			if (!input.value.trim()) {
				if (!error) setError("Campo obrigatório");
			}
			if (input.type === "email" && !input.value.includes("@")) {
				if (!error) setError("Email inválido");
			}
		}

		if (error !== "") {
			requiredFields[0].focus();
			return true;
		}
		
		return false;
	}

	useEffect(()=>{

		let token = localStorage.getItem('token');
		if(token) navigate('/');

	},[navigate]);

	async function sendForm() {
		if(sending) return;
		try{
			setSending(true);
			setError("");

			let hasError = await validateFields();
			if(hasError) return;

			let api_response = await Api.forgotPassword(email);
	
			if(!api_response.success) throw api_response;

			alert("Um e-mail de redefinição foi enviado.");

			navigate('/');

		}catch(err){

			alert("Algo deu errado, por favor, tente novamente.");
			console.error(err);

		}finally{
			setSending(false);
		}
	}

	function handleKeyDown(event) {
		if (event.key === "Enter") {
			sendForm();
		}
	}

	return (
		<div className="login-container column-centered" onKeyDown={handleKeyDown} ref={formRef}>
			<div className="login-form column-centered">
				<CustomTextInput
					name="email" label="Email" placeholder="seuemail@email.com" type="email" required
					value={email} onChange={(e) => setEmail(e)} errorMessage={error}
				/>
				<button className="login-button" onClick={sendForm}>
					{sending ? <LoadingIcon size={16}/> : 'Enviar'}
				</button>
			</div>
		</div>
	);
}

export default ForgotPassword;