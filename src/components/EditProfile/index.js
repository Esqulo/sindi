import React, { useState, useEffect } from "react";
import "./styles.css";

import LoadingIcon from "../LoadingIcon";
import CustomForm from "../CustomForm";
import Api from "../../Api";

function EditProfile() {

    const [accountData,setAccountData] = useState({});
    const [formError, setFormError] = useState("");
    const [trustee_fields, setTrustee_fields] = useState({
		name: { label: "Nome Completo", placeholder: "José da Silva", type: "text", disabled: true},
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "text", disabled: true },
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999" },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", disabled: true },
		cep: { label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999" },
		state: { label: "Estado", placeholder: "MG", type: "text" },
		city: { label: "Cidade", placeholder: "Belo Horizonte", type: "text" },
		neighbourhood: { label: "Bairro", placeholder: "Centro", type: "text" },
		address: { label: "Endereço", placeholder: "Rua das Oliveiras", type: "text" },
		number: { label: "Número", placeholder: "123", type: "text" },
		complement: { label: "Complemento", placeholder: "Apto. 201", type: "text" },
		doc: { label: "CPF/CNPJ", type: "text", disabled: true },
		rg: { label: "RG", placeholder: "00000000", type: "text", disabled: true },
		bio: { label: "Apresentação", type: "textarea"},
		// work_since: { label: "Síndico profissional desde", placeholder: "31/12/1999", type: "date", min: "1920-01-01", max: getCurrentDate() },
		password: { label: "Alterar Senha", placeholder: "**********", type: "password" },
		confirmPassword: { label: "Confirme a senha", placeholder: "**********", type: "password" }
	});
    const [consumer_fields, setConsumer_fields] = useState({
		place_name: { label: "Nome do condomínio", placeholder: "Vila Verde Residencial", type: "text" },
		units: { label: "Número de unidades", placeholder: "100", type: "numeric" },
		name: { label: "Nome Completo", placeholder: "José da Silva", type: "text", disabled: true },
		doc_number: { label: "CPF", placeholder: "111.222.333-12", type: "numeric", mask: "999.999.999-99", disabled: true },
		position: { label: "Cargo/Função", placeholder: "Morador / Conselheiro / Síndico", type: "text", required: false },
		phone: { label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999" },
		email: { label: "Email", placeholder: "seuemail@email.com", type: "email", disabled: true },
		birthdate: { label: "Data de nascimento", placeholder: "31/12/1999", type: "text", disabled: true },
		cep: { label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999" },
		state: { label: "Estado", placeholder: "MG", type: "text" },
		city: { label: "Cidade", placeholder: "Belo Horizonte", type: "text" },
		neighbourhood: { label: "Bairro", placeholder: "Centro", type: "text" },
		address: { label: "Endereço", placeholder: "Rua das Oliveiras", type: "text" },
		number: { label: "Número", placeholder: "123", type: "text" },
		complement: { label: "Complemento", placeholder: "Apto. 201", type: "text" },
        bio: { label: "Apresentação", type: "textarea"},
		password: { label: "Alterar Senha", placeholder: "**********", type: "password" },
		confirmPassword: { label: "Confirme a senha", placeholder: "**********", type: "password" },
	});

    async function handleSubmit(formValues){
        try {
            setFormError('');

            let api_response = await Api.updateProfile(formValues);
			if(!api_response.success) throw api_response;
            alert("campos atualizados com sucesso");
		} catch (error) {
			setFormError(`Erro: Operação não realizada. <br><br> Mensagem: ${error.message}. cod.: ${error.status}.`);
		}
    };

    async function getProfileData() {
        try{
            let apiResponse = await Api.requestFullProfile();
            setAccountData(apiResponse);
            if(apiResponse.user_type === 1){
                setTrustee_fields((prev) => ({
                    ...prev,
                    name: { ...prev.name, placeholder: apiResponse.name },
                    birthdate: { ...prev.birthdate, placeholder: apiResponse.birthdate },
                    phone: { ...prev.phone, placeholder: apiResponse.phone },
                    email: { ...prev.email, placeholder: apiResponse.email },
                    cep: { ...prev.cep, placeholder: apiResponse.cep },
                    state: { ...prev.state, placeholder: apiResponse.state },
                    city: { ...prev.city, placeholder: apiResponse.city },
                    neighbourhood: { ...prev.neighbourhood, placeholder: apiResponse.neighbourhood },
                    address: { ...prev.address, placeholder: apiResponse.address },
                    number: { ...prev.number, placeholder: apiResponse.number },
                    complement: { ...prev.complement, placeholder: apiResponse.complement },
                    doc: { ...prev.doc, placeholder: apiResponse.doc_number },
                    rg: { ...prev.rg, placeholder: apiResponse.id_number },
                    bio: { ...prev.bio, placeholder: apiResponse.bio },
                    // work_since: { ...prev.work_since, value: apiResponse.work_since },
                }));
            }else{
                setConsumer_fields((prev) => ({
                    ...prev,
                    name: { ...prev.name, placeholder: apiResponse.name },
                    birthdate: { ...prev.birthdate, placeholder: apiResponse.birthdate },
                    phone: { ...prev.phone, placeholder: apiResponse.phone },
                    email: { ...prev.email, placeholder: apiResponse.email },
                    cep: { ...prev.cep, placeholder: apiResponse.cep },
                    state: { ...prev.state, placeholder: apiResponse.state },
                    city: { ...prev.city, placeholder: apiResponse.city },
                    neighbourhood: { ...prev.neighbourhood, placeholder: apiResponse.neighbourhood },
                    address: { ...prev.address, placeholder: apiResponse.address },
                    number: { ...prev.number, placeholder: apiResponse.number },
                    complement: { ...prev.complement, placeholder: apiResponse.complement },
                    doc_number: { ...prev.doc_number, placeholder: apiResponse.doc_number },
                    position: { ...prev.position, placeholder: apiResponse.position },
                    bio: { ...prev.bio, placeholder: apiResponse.bio },
                }));
            }
        }catch(err){
            console.err(err);
        }
    }

    useEffect(()=>{
        getProfileData();
        //eslint-disable-next-line
    },[])

    return (
        <div className="edit-profile-container">
            <h2>Editar Perfil</h2>
            {accountData.user_type !== undefined ? (
                accountData.user_type === 1 ? (
                    <CustomForm fields={trustee_fields} onSubmit={handleSubmit} ButtonText={"Enviar"} formError={formError}/>
                ) : (
                    <CustomForm fields={consumer_fields} onSubmit={handleSubmit} ButtonText={"Enviar"} formError={formError}/>
                )
            ) : (
                <LoadingIcon color="#000"/>
            )}
        </div>
    );
}

export default EditProfile;
