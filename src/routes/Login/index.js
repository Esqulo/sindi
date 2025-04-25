import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

import CustomTextInput from "../../components/CustomTextInput";

import Api from "../../Api";

import LoadingIcon from "../../components/LoadingIcon";

function Login() {
	const [fields, setFields] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({});
	const [accountCreated, setAccountCreated] = useState(false);
	const [formError, setformError] = useState("");
	const [loading, setLoading] = useState(false);
	const formRef = useRef(null);

	const navigate = useNavigate();

	async function validateFields() {

		const requiredFields = formRef.current.querySelectorAll("input[required]");
		let newErrors = {};
		let firstErrorField = null;

		for (let input of requiredFields) {
			if (!input.value.trim()) {
				const name = input.getAttribute("name");
				if (!newErrors[name]) newErrors[name] = "Campo obrigatório";

				if (!firstErrorField) firstErrorField = input;
			}
			if (input.type === "email" && !input.value.includes("@")) {
				const name = input.getAttribute("name");
				if (!newErrors[name]) newErrors[name] = "Email inválido";

				if (!firstErrorField) firstErrorField = input;
			}
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length !== 0) {
			firstErrorField.focus();
			return true;
		}
		
		return false;
	}

	useEffect(()=>{

		let token = localStorage.getItem('token');
		if(token) window.location.href = '/';

		const params = new URLSearchParams(window.location.search);

		const welcome = params.get("welcome");

		if(welcome)	setAccountCreated(true);

	},[]);

	async function handleLogin() {
		
		setLoading(true);
		setformError("");

		try{

			let hasErros = await validateFields();
			if(hasErros) return;

			let api_response = await Api.login({
				username: fields.email,
				password: fields.password
			});
	
			if(!api_response.success) throw api_response;

			localStorage.setItem('token', api_response.token.toString());

			window.location.href = '/';

		}catch(err){
			err.status = err.status ? err.status : -1;
			
			switch(err.status){
				case 404:
					setformError("Email ou senha inválidos");
					break;
				default:
					setformError("Ocorreu um erro inesperado");
					break;
			}

		}finally{
			setLoading(false);
		}

	}

	function handleChange(name, value) {
		setFields((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	}

	function handleKeyDown(event) {
		if (event.key === "Enter") {
			handleLogin();
		}
	}

	return (
		<div className="login-container column-centered" onKeyDown={handleKeyDown} ref={formRef}>
			{accountCreated &&
				<span className="login-account-successfull">
					Sua conta foi criada com sucesso! <br/><br/> Confirme seu email para realizar o login.
				</span>
			}
			<div className="login-form column-centered">
				<CustomTextInput
					name="email" label="Email" placeholder="seuemail@email.com" type="email" required
					value={fields.email} onChange={(value) => handleChange("email", value)} errorMessage={errors.email}
				/>
				<CustomTextInput
					name="password" label="Senha" placeholder="**********" type="password" required
					value={fields.password} onChange={(value) => handleChange("password", value)} errorMessage={errors.password}
				/>
				<button className="login-button" onClick={handleLogin}>
					{loading ? <LoadingIcon size={16}/> : 'Entrar'}
				</button>
				{formError &&
					<span className="login-form-error_message">
						{formError}
					</span>
				}
				<span onClick={() => navigate("/forgotpassword")} className="login-form-forgotpassword">Esqueci a senha</span>
			</div>
		</div>
	);
}

export default Login;