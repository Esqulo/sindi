import React, { useState, useRef, useEffect } from "react";
import "./styles.css";

import CustomTextInput from "../../components/CustomTextInput";

function Login() {
	const [fields, setFields] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({});
	const [accountCreated, setAccountCreated] = useState(false);
	const formRef = useRef(null);

	function validateFields() {
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
		}
	}

	useEffect(()=>{

		const params = new URLSearchParams(window.location.search);

		const welcome = params.get("welcome");

		if(welcome)	setAccountCreated(true);

	},[]);

	function handleLogin() {
		validateFields();
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
				<button className="login-button" onClick={handleLogin}>Entrar</button>
				<a href="/forgotpassword" className="login-form-forgotpassword"><span >Esqueci a senha</span></a>
			</div>
		</div>
	);
}

export default Login;
