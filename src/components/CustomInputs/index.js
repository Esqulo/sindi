import React, { useState, useEffect } from "react";import "./styles.css";
import MaskedInput from "react-input-mask";

const CustomTextInput = function ({name, value, label, placeholder, type="text", required=false, onChange, inputRef, errorMessage, customStyle, mask, disabled, min, max}) {
    return (
        <div className="custom-text-input">
            <label className="custom-text-input-label">{label}</label>
            <MaskedInput 
                className="custom-text-input-field"
                name={name}
                value={value}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                mask={mask}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                ref={inputRef}
                style={customStyle}
            />
            {errorMessage && <span className="custom-text-input-error">{errorMessage}</span>}
        </div>
    )
}

const CustomCheckInput = function({name, value, label, required=false, onChange, inputRef, errorMessage, customStyle}) {
    return (
        <div className="custom-check-input">
            <div className="custom-check-input-row">
                <input 
                    className="custom-check-input-field"
                    name={name} 
                    value={value}
                    type="checkbox"
                    required={required}
                    onChange={(e) => onChange(e.target.checked)}
                    ref={inputRef}
                />
                <label className="custom-check-input-label" dangerouslySetInnerHTML={{ __html: label }} />
            </div>
            {errorMessage && <span className="custom-check-input-error">{errorMessage}</span>}
        </div>
    )
}

const CustomDocInput = ({ name, value, label, required = false, whenChange, inputRef, disabled, customStyle }) => {
    const [docType, setDocType] = useState("cpf");
    const [docNumber, setDocNumber] = useState("");
    const [error, setError] = useState("");
    const [pristine, setPristine] = useState(true);

    const masks = {
        cpf: "999.999.999-99",
        cnpj: "99.999.999/9999-99"
    };

    const placeholders = {
        cpf: "000.000.000-00",
        cnpj: "00.000.000/0000-00"
    };

    function validateCPF(cpf) {

        try{
            cpf = cpf.replace(/\D/g, "");

            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) throw new Error("CPF inválido");

            let sum = 0, remainder;

            for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);

            remainder = (sum * 10) % 11;

            if (remainder === 10 || remainder === 11) remainder = 0;

            if (remainder !== parseInt(cpf[9])) throw new Error("CPF inválido");

            sum = 0;

            for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);

            remainder = (sum * 10) % 11;

            if (remainder === 10 || remainder === 11) remainder = 0;

            if(remainder !== parseInt(cpf[10])) throw new Error ("CPF inválido");

            return true;

        }catch(e){
            setError(e.message);
            return false;
        }

    };

    function validateCNPJ(cnpj) {

        try{
            cnpj = cnpj.replace(/\D/g, "");

            if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) throw new Error("CNPJ inválido");
    
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
            if (result !== parseInt(digits.charAt(0))) throw new Error("CNPJ inválido");
    
            size = size + 1;
            numbers = cnpj.substring(0, size);
            sum = 0;
            pos = size - 7;
    
            for (let i = size; i >= 1; i--) {
                sum += numbers.charAt(size - i) * pos--;
                if (pos < 2) pos = 9;
            }
    
            result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
            if (result !== parseInt(digits.charAt(1))) throw new Error("CNPJ inválido");

            return true;
            
        }catch(e){
            setError(e.message);
            return false;
        }

    }

    function validateDocument(type,doc){

        setError("");

        doc = doc.replace(/\D/g, "");
    
        if (type === "cpf") return validateCPF(doc);
        if (type === "cnpj") return validateCNPJ(doc);

        setError("Número inválido");
        
        return false;
    };

    useEffect(() => {
 
        const isValid = validateDocument(docType,docNumber);

        whenChange({
            type: docType,
            value: docNumber.replace(/\D/g, ""),
            isValid,
            errorMessage: error
        });
        //its working, im gonna deal with this later...
        //eslint-disable-next-line
    }, [docType, docNumber]);

    return (
        <div className="custom-doc-input">
            <label className="custom-doc-input-label">{label}</label>
            <div className="custom-doc-input-row">
                <select className="custom-doc-input-select" value={docType} disabled={disabled}
                    onChange={(e) => {
                        setDocNumber("");
                        setDocType(e.target.value);
                        setPristine(true);
                    }} 
                >
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                </select>
                <MaskedInput
                    className="custom-doc-input-field"
                    name={name}
                    value={docNumber}
                    type="numeric"
                    placeholder={placeholders[docType]}
                    disabled={disabled}
                    required={required}
                    mask={masks[docType]}
                    onChange={(e) => {
                        setDocNumber(e.target.value);
                        setPristine(false);
                    }}
                    ref={inputRef}
                    style={customStyle}
                />
            </div>
            {error && !pristine && <span className="custom-doc-input-error">{error}</span>}
        </div>
    );
};

export {
    CustomTextInput,
    CustomCheckInput,
    CustomDocInput
};