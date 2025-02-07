import React, { useState, useRef, useEffect, useCallback} from "react";
import "./styles.css";

import CustomTextInput from "../CustomTextInput";
import CustomCheckInput from "../CustomCheckInput";

import Api from "../../Api";

function CustomForm({fields, onSubmit, ButtonText, customStyle}) {
    const [errors, setErrors] = useState({});
    const [hookFields, setHookFields] = useState(fields);
    const [fieldValues, setFieldValues] = useState({});
    const formRef = useRef(null);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            sendForm();
        }
    }

    const handleChange = useCallback((name, value) => {
        setFieldValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }, []);
    
    const updateFieldProperty = useCallback((fieldName, property, newValue) => {
        setHookFields((prevFields) => ({
            ...prevFields,
            [fieldName]: {
                ...prevFields[fieldName],
                [property]: newValue
            }
        }));
    }, []);

    function validateForm() {
        let requiredFields = formRef.current.querySelectorAll("input[required]");
        let newErrors = {};
        let firstErrorField = null;
    
        for (let input of requiredFields) {
            const name = input.getAttribute("name");

            if (!input.value.trim() || (input.type === "checkbox" && !input.checked)) { 
                if(!newErrors[name]) newErrors[name] = "Campo obrigatório";
                if (!firstErrorField) firstErrorField = input;
            }

            if(input.type === "email" && !input.value.includes("@")){
                if(!newErrors[name]) newErrors[name] = "Email inválido";
                if (!firstErrorField) firstErrorField = input;
            }

            if(input.type === "tel" && !input.value.length < 11){
                if(!newErrors[name]) newErrors[name] = "Número inválido";
                if (!firstErrorField) firstErrorField = input;
            }

            if(input.type === "cep"){
                let isCepOk = checkCep();
                if(!isCepOk){
                    if(!newErrors[name]) newErrors[name] = "CEP inválido";
                    if(!firstErrorField) firstErrorField = input;
                }
            }

            if(input.name === "cpf"){
                let isCpfValid = validateCPF(input.value);
                if(!isCpfValid){
                    if(!newErrors[name]) newErrors[name] = "CPF Inválido";
                    if(!firstErrorField) firstErrorField = input;
                }
            }

            if(input.name === "cnpj"){
                let isCnpjValid =  validateCNPJ(input.value)
                if(!isCnpjValid){
                    if(!newErrors[name]) newErrors[name] = "CNPJ Inválido";
                    if(!firstErrorField) firstErrorField = input;
                }
            }
        }
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length !== 0){
            firstErrorField.focus();
            return true;
        }

        return false;
    }

    function validateCPF(cpf){
        cpf = cpf.replace(/\D/g, "");
    
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
        let sum = 0, remainder;

        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;

        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        
        return remainder === parseInt(cpf.charAt(10));
    }

    function validateCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, "");

        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

        let size = cnpj.length - 2;
        let numbers = cnpj.substring(0, size);
        let digits = cnpj.substring(size);
        let sum = 0;
        let pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += numbers.charAt(size - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        size = size + 1;
        numbers = cnpj.substring(0, size);
        sum = 0;
        pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += numbers.charAt(size - i) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        return result === parseInt(digits.charAt(1));
    }
    
    function sendForm() {
        let hasErrors = validateForm();
        if(!hasErrors) onSubmit();
    }

    const checkPasswordsMatch = useCallback(async () => {

        if (!fieldValues.password || !fieldValues.confirmPassword) return;
    
        if (fieldValues.password !== fieldValues.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "As senhas não coincidem" }));
        } else {
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }

    }, [fieldValues.password, fieldValues.confirmPassword]);

    async function getCepData(cep){
        let cepData = await Api.cep({cep});
            
        if (cepData.erro) {
            setErrors((prev) => ({ ...prev, cep: "CEP inválido" }));
            return false;
        }

        return cepData;
    }

    const setLocationFields = useCallback((cepData) => {

        if (cepData.uf) updateFieldProperty('state', 'disabled', true);
        handleChange('state', cepData.uf);
    
        if (cepData.logradouro) updateFieldProperty('address', 'disabled', true);
        handleChange('address', cepData.logradouro);
    
        if (cepData.bairro) updateFieldProperty('neighbourhood', 'disabled', true);
        handleChange('neighbourhood', cepData.bairro);
    
        if (cepData.localidade) updateFieldProperty('city', 'disabled', true);
        handleChange('city', cepData.localidade);

    }, [handleChange, updateFieldProperty]);

    const setErrorMessage = useCallback((field, message) => {
        setErrors((prev) => ({ ...prev, [field]: message }))
    }, []);
    
    const checkCep = useCallback(async () => {

        if (!fieldValues.cep) return;
        
        let cep = fieldValues.cep.replace(/\D/g, '');
    
        if (!cep || cep.length < 8) return false;
    
        let cepData = await getCepData(cep);
    
        if (!cepData) return false;
    
        setLocationFields(cepData);
    
        return true;

    }, [fieldValues.cep, setLocationFields]); 

    const checkCpf = useCallback(async () => {

        if(!fieldValues.cpf) return;

        let cpf = fieldValues.cpf.replace(/\D/g, '');
        if(!cpf || cpf.length !== 11) return;

        let isCpfValid = validateCPF(cpf);
        if(isCpfValid) return;

        setErrorMessage('cpf','CPF Inválido')

    }, [fieldValues.cpf,setErrorMessage]);

    const checkCnpj = useCallback(async () => {

        if(!fieldValues.cnpj) return;

        let cnpj = fieldValues.cnpj.replace(/\D/g, '');
        if(!cnpj || cnpj.length !== 14) return;

        let isCnpjValid = validateCNPJ(cnpj);
        if(isCnpjValid) return;

        setErrorMessage('cnpj','CNPJ Inválido')

    }, [fieldValues.cnpj,setErrorMessage]); 

    useEffect(() => { checkCpf(); }, [checkCpf]);
    
    useEffect(() => { checkCnpj(); }, [checkCnpj]);

    useEffect(() => { checkCep(); }, [checkCep]);

    useEffect(() => { checkPasswordsMatch(); }, [checkPasswordsMatch]);

    return(
        <div className="custom-form-container" onKeyDown={handleKeyDown} ref={formRef} style={customStyle}>
            {
                Object.entries(hookFields).map(
                    ([name, field])=>{

                        return field.type === "checkbox" ? (
                            <CustomCheckInput
                                key={name}
                                name={name}
                                value={fieldValues[name]}
                                label={field.label}
                                required={field.required}
                                disabled={field.disabled}
                                onChange={(value) => handleChange(name, value)}
                                errorMessage={errors[name]}
                            />
                        ) : (
                            <CustomTextInput
                                key={name}
                                name={name}
                                value={fieldValues[name]}
                                label={field.label}
                                placeholder={field.placeholder}
                                mask={field.mask}
                                type={field.type}
                                required={field.required}
                                disabled={field.disabled}
                                onChange={(value) => handleChange(name, value)}
                                errorMessage={errors[name]}
                            />
                        );
                    }
                )
            }
            <button className="custom-form-send_button" onClick={sendForm}>{ButtonText}</button>
        </div>
    );
}

export default CustomForm;