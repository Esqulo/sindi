import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

import CustomTextInput from "../../components/CustomTextInput";
import Api from "../../Api";
import LoadingIcon from "../../components/LoadingIcon";

function SetNewPassword() {
	const [fields, setFields] = useState({ password: "", confirmPassword: "" });
	const [errors, setErrors] = useState({});
	const [formError, setformError] = useState("");
	const [loading, setLoading] = useState(false);
	const formRef = useRef(null);
	const navigate = useNavigate();

	const [token, setToken] = useState("");

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get("t");
		if (urlToken) setToken(urlToken);
	}, []);

	function validatePassword(password) {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&.;?'",:{}\-+=`_^]).{8,}$/;
		return regex.test(password);
	}

	async function validateFields() {
		let newErrors = {};
		if (!fields.password) newErrors.password = "Campo obrigatório";
		else if (!validatePassword(fields.password)) {
			newErrors.password = "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.";
		}

		if (!fields.confirmPassword) newErrors.confirmPassword = "Campo obrigatório";
		else if (fields.confirmPassword !== fields.password) {
			newErrors.confirmPassword = "As senhas não coincidem";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length > 0;
	}

	async function handleSubmit() {
		setLoading(true);
		setformError("");

		try {
			let hasErrors = await validateFields();
			if (hasErrors) return;

			let api_response = await Api.updatePassword(token, fields.password);

			if (!api_response.success) throw api_response;

			alert("Senha redefinida com sucesso!");
			navigate("/login");

		} catch (err) {
			setformError("Erro ao redefinir a senha.");
		} finally {
			setLoading(false);
		}
	}

	function handleChange(name, value) {
		setFields((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	}

	function handleKeyDown(event) {
		if (event.key === "Enter") {
			handleSubmit();
		}
	}

	return (
		<div className="login-container column-centered" onKeyDown={handleKeyDown} ref={formRef}>
			<div className="login-form column-centered">
				<CustomTextInput
					name="password" label="Nova Senha" placeholder="**********" type="password" required
					value={fields.password} onChange={(value) => handleChange("password", value)} errorMessage={errors.password}
				/>
				<CustomTextInput
					name="confirmPassword" label="Confirmar Senha" placeholder="**********" type="password" required
					value={fields.confirmPassword} onChange={(value) => handleChange("confirmPassword", value)} errorMessage={errors.confirmPassword}
				/>
				<button className="login-button" onClick={handleSubmit}>
					{loading ? <LoadingIcon size={16} /> : 'Redefinir Senha'}
				</button>
				{formError &&
					<span className="login-form-error_message">
						{formError}
					</span>
				}
			</div>
		</div>
	);
}

export default SetNewPassword;
