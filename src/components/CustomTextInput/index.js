import React from "react";
import "./styles.css";
import MaskedInput from "react-input-mask";

function CustomTextInput({name, label, placeholder, type="text", required=false, onChange, inputRef, errorMessage, customStyle, mask}) {
    return (
        <div className="custom-text-input">
            <label className="custom-text-input-label">{label}</label>
            <MaskedInput 
                className="custom-text-input-field"
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                mask={mask}
                onChange={(e) => onChange(e.target.value)}
                ref={inputRef}
            />
            {errorMessage && <span className="custom-text-input-error">{errorMessage}</span>}
        </div>
    )
}

export default CustomTextInput;