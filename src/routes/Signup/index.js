import React, {useState} from "react";
import "./styles.css";

import CustomForm from "../../components/CustomForm";
import CustomRadioContainer from "../../components/CustomRadioContainer";

function Signup() {

  const [selectedRadio, setSelectedRadio] = useState("");
 
  const radioInputs = {
    consumer: {label:"Condômino", value:"consumer"},
    trustee: {label:"Síndico", value:"trustee"}
  }

  const trustee_fields = {
    name: {label: "Nome", placeholder: "José da Silva", type: "text", required: true},
    email: {label: "Email", placeholder: "seuemail@email.com", type: "email", required: true},
    cnpj: {label: "CNPJ", placeholder: "12.345.678/0001-99", type: "numeric", mask: "99.999.999/9999-99", required: true},
    phone: {label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true},
    cep: {label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999", required: true},
    state: {label: "Estado", placeholder: "MG", type: "text", required: true},
    city: {label: "Cidade", placeholder: "Belo Horizonte", type: "text", required: true},
    neighbourhood: {label: "Bairro", placeholder: "Centro", type: "text", required: true},
    address: {label: "Endereço", placeholder: "Rua das Oliveiras", type: "text", required: true},
    number: {label: "Número", placeholder: "123", type: "text", required: true},
    complement: {label: "Complemento", placeholder: "Apto. 201", type: "text"},
    password: {label: "Senha", placeholder: "**********", type: "password", required: true},
    confirmPassword: {label: "Confirme a senha", placeholder: "**********", type: "password", required: true},
    terms: {label: 'Eu concordo com os <a href="/terms">termos</a> de serviço e <a href="/privacy">privacidade</a>', type: "checkbox", required: true},
  };

  const consumer_fields = {
    name: {label: "Nome", placeholder: "José da Silva", type: "text", required: true},
    email: {label: "Email", placeholder: "seuemail@email.com", type: "email", required: true},
    cpf: {label: "CPF", placeholder: "111.222.333-12", type: "numeric", mask: "999.999.999-99", required: true},
    phone: {label: "Celular", placeholder: "(12) 91234-1234", type: "tel", mask: "(99) 99999-9999", required: true},
    cep: {label: "Cep", placeholder: "12345-678", type: "numeric", mask: "99999-999", required: true},
    state: {label: "Estado", placeholder: "MG", type: "text", required: true},
    city: {label: "Cidade", placeholder: "Belo Horizonte", type: "text", required: true},
    neighbourhood: {label: "Bairro", placeholder: "Centro", type: "text", required: true},
    address: {label: "Endereço", placeholder: "Rua das Oliveiras", type: "text", required: true},
    number: {label: "Número", placeholder: "123", type: "text", required: true},
    complement: {label: "Complemento", placeholder: "Apto. 201", type: "text"},
    password: {label: "Senha", placeholder: "**********", type: "password", required: true},
    confirmPassword: {label: "Confirme a senha", placeholder: "**********", type: "password", required: true},
    terms: {label: 'Eu concordo com os <a href="/terms">termos</a> de serviço e <a href="/privacy">privacidade</a>', type: "checkbox", required: true},
  };

  function handleRadioChange(value){
    setSelectedRadio(value);
  };

  function sendRegister() {
    console.log("tada");
  }

  return (
    <div className="signup-container column-centered">
      <CustomRadioContainer fields={radioInputs} groupName={"accountType"} onChangeAction={handleRadioChange}/>
      { selectedRadio === 'trustee' &&
        <CustomForm fields={trustee_fields} onSubmit={sendRegister} ButtonText={"Enviar"} />
      }
      { selectedRadio === 'consumer' &&
        <CustomForm fields={consumer_fields} onSubmit={sendRegister} ButtonText={"Enviar"} />
      }
    </div>
  );
}

export default Signup;