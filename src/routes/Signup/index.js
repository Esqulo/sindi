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
		name: { label: "Nome Completo", placeholder: "José da Silva", type: "text", required: true },
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate(), required: true },
		//gender: { label: "Gênero", type: "options", required: true, options: []},
		// marital_status: { label: "Estado Civil", placeholder: "Casado", type: "text", required: false },
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", required: true },
		cep: { label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999", required: true },
		state: { label: "Estado", placeholder: "MG", type: "text", required: true },
		city: { label: "Cidade", placeholder: "Belo Horizonte", type: "text", required: true },
		neighbourhood: { label: "Bairro", placeholder: "Centro", type: "text", required: true },
		address: { label: "Endereço", placeholder: "Rua das Oliveiras", type: "text", required: true },
		number: { label: "Número", placeholder: "123", type: "text", required: true },
		complement: { label: "Complemento", placeholder: "Apto. 201", type: "text" },
		doc: { label: "CPF/CNPJ", type: "doc", required: true },
		rg: { label: "RG", placeholder: "00000000", type: "text", required: true },
		//Formações
		work_since: { label: "Síndico profissional desde", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate(), required: true },
		//work_fields
		password: { label: "Senha", placeholder: "**********", type: "password", required: true },
		confirmPassword: { label: "Confirme a senha", placeholder: "**********", type: "password", required: true },
		terms: { label: 'Eu concordo com os <a href="/terms">termos</a> de serviço e <a href="/privacy">privacidade</a>', type: "checkbox", required: true },
	};

	const consumer_fields = {
		place_name: { label: "Nome do condomínio", placeholder: "Vila Verde Residencial", type: "text", required: true },
		//place_type: { label: "Tipo de condomínio", type: "options", required: true, options: []},
		units: { label: "Número de unidades", placeholder: "100", type: "numeric", required: true },
		//3rd_party
		//professionals
		name: { label: "Nome Completo", placeholder: "José da Silva", type: "text", required: true },
		cpf: { label: "CPF", placeholder: "111.222.333-12", type: "numeric", mask: "999.999.999-99", required: true },
		position: { label: "Cargo/Função", placeholder: "Morador / Conselheiro / Síndico", type: "text", required: false },
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", required: true },
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate(), required: true },
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
		//looks dumb... will take a look on it later
		let formValues = {
			name: values?.name,
			birthdate: values?.birthdate,
			email: values?.email,
			cep: values?.cep,
			state: values?.state,
			city: values?.city,
			neighbourhood: values?.neighbourhood,
			address: values?.address,
			number: values?.number,
			complement: values?.complement,
			position: values?.position,
			password: values?.password,
			user_type: selectedRadio === 'consumer' ? '0' : '1',
			doc_type: selectedRadio === 'consumer' ? 'cpf' : values?.doc.type,
			doc_number: selectedRadio === 'consumer' ? values?.cpf : values?.doc.value,
			id_number: values?.rg,
			work_since: values?.work_since,
			phone: values?.phone,
			terms: values?.terms,
			place_name: values?.place_name,
			units: values?.units
		};

		try {
			let api_response = await Api.newUser(formValues);
			if(api_response !== true) throw api_response;

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