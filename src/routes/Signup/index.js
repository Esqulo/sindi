import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

import CustomForm from "../../components/CustomForm";
import CustomRadioContainer from "../../components/CustomRadioContainer";

import Api from "../../Api";

function Signup() {

	const navigate = useNavigate();

	const [selectedRadio, setSelectedRadio] = useState("");
	const [formError, setFormError] = useState("");

	const radioInputs = {
		consumer: { label: "Condômino", value: "consumer" },
		trustee: { label: "Síndico", value: "trustee" }
	}

	function getCurrentDate() {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	const trustee_fields = {
		name: { label: "Nome", placeholder: "José da Silva", type: "text", required: true },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", required: true },
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate(), required: true },
		cnpj: { label: "CNPJ", placeholder: "12.345.678/0001-99", type: "numeric", mask: "99.999.999/9999-99", required: true },
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true },
		cep: { label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999", required: true },
		state: { label: "Estado", placeholder: "MG", type: "text", required: true },
		city: { label: "Cidade", placeholder: "Belo Horizonte", type: "text", required: true },
		neighbourhood: { label: "Bairro", placeholder: "Centro", type: "text", required: true },
		address: { label: "Endereço", placeholder: "Rua das Oliveiras", type: "text", required: true },
		number: { label: "Número", placeholder: "123", type: "text", required: true },
		complement: { label: "Complemento", placeholder: "Apto. 201", type: "text" },
		password: { label: "Senha", placeholder: "**********", type: "password", required: true },
		confirmPassword: { label: "Confirme a senha", placeholder: "**********", type: "password", required: true },
		terms: { label: 'Eu concordo com os <a href="/terms">termos</a> de serviço e <a href="/privacy">privacidade</a>', type: "checkbox", required: true },
	};

	const consumer_fields = {
		name: { label: "Nome", placeholder: "José da Silva", type: "text", required: true },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", required: true },
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate(), required: true },
		cpf: { label: "CPF", placeholder: "111.222.333-12", type: "numeric", mask: "999.999.999-99", required: true },
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true },
		cep: { label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999", required: true },
		state: { label: "Estado", placeholder: "MG", type: "text", required: true },
		city: { label: "Cidade", placeholder: "Belo Horizonte", type: "text", required: true },
		neighbourhood: { label: "Bairro", placeholder: "Centro", type: "text", required: true },
		address: { label: "Endereço", placeholder: "Rua das Oliveiras", type: "text", required: true },
		number: { label: "Número", placeholder: "123", type: "text", required: true },
		complement: { label: "Complemento", placeholder: "Apto. 201", type: "text" },
		password: { label: "Senha", placeholder: "**********", type: "password", required: true },
		confirmPassword: { label: "Confirme a senha", placeholder: "**********", type: "password", required: true },
		terms: { label: 'Eu concordo com os <a href="/terms">termos</a> de serviço e <a href="/privacy">privacidade</a>', type: "checkbox", required: true },
	};

	function handleRadioChange(value) {
		setSelectedRadio(value);
	};

	async function sendRegister(values) {
		setFormError('');
		let formValues = {
			email: values?.email,
			name: values?.name,
			password: values?.password,
			birthdate: values?.birthdate,
			user_type: selectedRadio === 'consumer' ? '0' : '1',
			doc_number: selectedRadio === 'consumer' ? values?.cpf : values?.cnpj,
			phone: values?.phone,
			cep: values?.cep,
			state: values?.state,
			city: values?.city,
			neighbourhood: values?.neighbourhood,
			address: values?.address,
			number: values?.number,
			complement: values?.complement,
			terms: values?.terms
		};
		try {
			let api_response = await Api.newUser(formValues);
			if(api_response.status !== 201) throw api_response;

			navigate('/login?welcome=true');

		} catch (error) {
			setFormError(`Erro: Operação não realizada. <br><br> Mensagem: ${error.message}. cod.: ${error.status}.`);
		}
	}

	return (
		<div className="signup-container column-centered">
			<CustomRadioContainer fields={radioInputs} groupName={"accountType"} onChangeAction={handleRadioChange} />
			{selectedRadio === 'trustee' &&
				<CustomForm fields={trustee_fields} onSubmit={sendRegister} ButtonText={"Enviar"} formError={formError}/>
			}
			{selectedRadio === 'consumer' &&
				<CustomForm fields={consumer_fields} onSubmit={sendRegister} ButtonText={"Enviar"} formError={formError}/>
			}
		</div>
	);
}

export default Signup;