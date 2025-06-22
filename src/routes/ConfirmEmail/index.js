import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Api from "../../Api";

import LoadingIcon from "../../components/LoadingIcon";

function ConfirmEmail() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const navigate = useNavigate();

	const sendRequest = useCallback(async(token) => {
		if (loading) return;
		try{
			setLoading(true);
			const apiResponse = await Api.confirmEmail(token)
			if(apiResponse.success) return true;
			throw new Error("request failed");
		}catch(err){
			return false;
		}finally{
			setLoading(false);
		}
	},[loading]);

	const handleUrlToken = useCallback(async () => {

		const messages = {
			success: "E-mail confirmado com sucesso, você será redirecionado em alguns instantes",
			fail: "Falha ao confirmar email",
		}

		const params = new URLSearchParams(window.location.search);
		const confirmationToken = params.get("t");

		if(!confirmationToken) navigate("/");
		
		const emailConfirmed = await sendRequest(confirmationToken);

		if(!emailConfirmed){	
			setMessage(messages['fail']);
			return;
		}

		setMessage(messages['success']);
		
		setTimeout(() => {
			navigate("/")
		},10000);

	},[navigate, sendRequest])

	useEffect(()=>{
		handleUrlToken();
		//eslint-disable-next-line
	},[]);

	return (
		<div className="container">
			{ loading ? 
				<div className="loadingContainer"> <LoadingIcon color={"#000"}/> </div>
				: <h2 className="message">{message}</h2>
			}
		</div>
	);
}

export default ConfirmEmail;