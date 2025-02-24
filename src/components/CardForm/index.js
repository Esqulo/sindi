import React, { useState, useRef} from "react";
import "./styles.css";

import LoadingIcon from "../LoadingIcon";
import { CustomTextInput, CustomDocInput } from "../CustomInputs";

// import {
//     CardNumber,
//     SecurityCode,
//     ExpirationDate
// } from '@mercadopago/sdk-react';

function CardForm({onSubmit}) {
    
    const formRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const [errors, setErrors] = useState({});

    function handleChange(name, value){
        setFieldValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    function handleDocChange (docData){
        setFieldValues((prev) => ({ ...prev, "doc_number": docData.value }));
        if(!docData.isValid){
            setErrorMessage('doc_number','Documento Inválido');
            return;
        }
        setErrorMessage('doc_number','');
    }

    function setErrorMessage (field, message){
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    function validateForm() {
        let requiredFields = formRef.current.querySelectorAll("input[required]");
        let newErrors = {};
        let firstErrorField = null;
    
        for (let input of requiredFields) {
            
            const name = input.getAttribute("name");
            const value = fieldValues[name];

            if (!value || !value.trim() || (input.type === "checkbox" && !input.checked)) {
                if(!newErrors[name]) newErrors[name] = "Campo obrigatório";
                if (!firstErrorField) firstErrorField = input;
                continue;
            }

            if(input.type === "email" && !value.includes("@")){
                if(!newErrors[name]) newErrors[name] = "Email inválido";
                if (!firstErrorField) firstErrorField = input;
                continue;
            }

            if(name === "doc_number" && errors.doc_number){
                if(!newErrors[name]) newErrors[name] = "Documento Inválido";
                if(!firstErrorField) firstErrorField = input;
                continue;
            }

            if(name === "card_number" && removeMasks(value).length !== 16){
                if(!newErrors[name]) newErrors[name] = "Número inválido";
                if(!firstErrorField) firstErrorField = input;
                continue;
            }

            if(name === "security_code" && (value.length < 3 || value.length > 4)){
                if(!newErrors[name]) newErrors[name] = "Código inválido";
                if(!firstErrorField) firstErrorField = input;
                continue;
            }

            if(name === "expiration_date"){
                
                let dateInfo = checkDate(value);
                
                if(dateInfo.isValid) continue;

                if(!newErrors[name]) newErrors[name] = dateInfo.message;
                if(!firstErrorField) firstErrorField = input;

                continue;
            }

        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0){
            firstErrorField.focus();
            return true;
        }

        return false; 
    }

    function checkDate(date){

        const expValue = date.trim();
        const expRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
        
        if (!expRegex.test(expValue)) return {
            isValid: false,
            message: "Data inválida"
        }
        
        const [expMonthStr, expYearStr] = expValue.split("/");
        const expMonth = parseInt(expMonthStr, 10);
        const expYear = parseInt(expYearStr, 10);
        
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return {
            isValid: false,
            message: "Cartão expirado"
        }

        return {
            isValid: true
        };

    }

    function removeMasks(value) {
        return value.replace(/[-_./ ]/g, '');
    }

    async function sendForm() {

        setLoading(true);

        let hasErrors = validateForm();

        if(!hasErrors){            

            const values = {};
            
            for(let fieldName in fieldValues){
                values[fieldName] = fieldName === 'full_name' || fieldName === 'expiration_date' ? fieldValues[fieldName] : removeMasks(fieldValues[fieldName]); 
            }

            try {
                await onSubmit(values);
            } catch (error) {
                console.error(error);
            }
        }

        setLoading(false);

    }

    return (
        <div className="card-form-container" ref={formRef}>
            <CustomTextInput
                key={'card_number'}
                name={'card_number'}
                value={fieldValues['card_number']}
                label={'Número do cartão'}
                placeholder={'0000 0000 0000 0000'}
                mask={'9999 9999 9999 9999'}
                type={'numeric'}
                required={true}
                onChange={(value) => handleChange('card_number', value)}
                errorMessage={errors['card_number']}
            />
            <div className="half">
                <CustomTextInput
                    key={'security_code'}
                    name={'security_code'}
                    value={fieldValues['security_code']}
                    label={'Código de segurança'}
                    placeholder={'123'}
                    type={'numeric'}
                    required={true}
                    onChange={(value) => handleChange('security_code', value)}
                    errorMessage={errors['security_code']}
                />
            </div>
            <div className="half">
                <CustomTextInput
                    key={'expiration_date'}
                    name={'expiration_date'}
                    value={fieldValues['expiration_date']}
                    label={'Validade'}
                    placeholder={'DD/MMMM'}
                    mask={'99/9999'}
                    type={'numeric'}
                    required={true}
                    onChange={(value) => handleChange('expiration_date', value)}
                    errorMessage={errors['expiration_date']}
                />   
            </div>       
            <CustomTextInput
                key={'full_name'}
                name={'full_name'}
                value={fieldValues['full_name']}
                label={'Nome do titular'}
                placeholder={'José da Silva'}
                type={'text'}
                required={true}
                onChange={(value) => handleChange('full_name', value)}
                errorMessage={errors['full_name']}
            />
            <CustomDocInput
                key={'doc_number'}
                name={'doc_number'}
                value={fieldValues['doc_number']}
                label={'CPF/CNPJ'}
                required={true}
                whenChange={handleDocChange}
            />
            <CustomTextInput
                key={'email'}
                name={'email'}
                value={fieldValues['email']}
                label={'E-mail'}
                placeholder={'seuemail@email.com.br'}
                type={'email'}
                required={true}
                onChange={(value) => handleChange('email', value)}
                errorMessage={errors['email']}
            />
            <button className="custom-form-send_button" onClick={sendForm} disabled={loading}>
                {loading ? <LoadingIcon size={16}/> : "Enviar"}
            </button>
        </div>
    );
}

export default CardForm;