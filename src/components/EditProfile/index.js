import React, { useState } from "react";
import "./styles.css";

import CustomForm from "../CustomForm";

function EditProfile() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: ""
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Enviando dados atualizados:", formData);
        // Aqui você pode integrar com sua API
    };

    const trustee_fields = {
		name: { label: "Nome", placeholder: "José da Silva", type: "text", required: true },
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate(), required: true },
        //genero
        //estado civil
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", required: true },
		cnpj: { label: "CNPJ", placeholder: "12.345.678/0001-99", type: "numeric", mask: "99.999.999/9999-99", required: true },
		cep: { label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999", required: true },//doc
        //rg
		state: { label: "Estado", placeholder: "MG", type: "text", required: true },
		city: { label: "Cidade", placeholder: "Belo Horizonte", type: "text", required: true },
		neighbourhood: { label: "Bairro", placeholder: "Centro", type: "text", required: true },
		address: { label: "Endereço", placeholder: "Rua das Oliveiras", type: "text", required: true },
		number: { label: "Número", placeholder: "123", type: "text", required: true },
		complement: { label: "Complemento", placeholder: "Apto. 201", type: "text" },
        //Formação acadêmica
        //outras
		password: { label: "Senha", placeholder: "**********", type: "password", required: true },
		confirmPassword: { label: "Confirme a senha", placeholder: "**********", type: "password", required: true },
		terms: { label: 'Eu concordo com os <a href="/terms">termos</a> de serviço e <a href="/privacy">privacidade</a>', type: "checkbox", required: true },
	};

	const consumer_fields = {
        //nome condomínio
        //tipo do condominio
        //numero de unidades (aptos/casas)
        //serviços
        //historico de sindicos profs
        cep: { label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999", required: true },
		state: { label: "Estado", placeholder: "MG", type: "text", required: true },
		city: { label: "Cidade", placeholder: "Belo Horizonte", type: "text", required: true },
		neighbourhood: { label: "Bairro", placeholder: "Centro", type: "text", required: true },
		address: { label: "Endereço", placeholder: "Rua das Oliveiras", type: "text", required: true },
		number: { label: "Número", placeholder: "123", type: "text", required: true },
		complement: { label: "Complemento", placeholder: "Apto. 201", type: "text" },
        name: { label: "Nome", placeholder: "José da Silva", type: "text", required: true },
		cpf: { label: "CPF", placeholder: "111.222.333-12", type: "numeric", mask: "999.999.999-99", required: true },
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate(), required: true },
        //cargo
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", required: true },
		password: { label: "Senha", placeholder: "**********", type: "password", required: true },
		confirmPassword: { label: "Confirme a senha", placeholder: "**********", type: "password", required: true },
		terms: { label: 'Eu concordo com os <a href="/terms">termos</a> de serviço e <a href="/privacy">privacidade</a>', type: "checkbox", required: true },
	};

    return (
        <div className="edit-profile-container">
            <h2>Editar Perfil</h2>

        </div>
    );
}

export default EditProfile;
