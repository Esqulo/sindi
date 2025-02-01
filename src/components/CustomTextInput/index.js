import React from "react";
import "./styles.css";
import MaskedInput from "react-input-mask";

function CustomTextInput({name, value, label, placeholder, type="text", required=false, onChange, inputRef, errorMessage, customStyle, mask, disabled}) {
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
                onChange={(e) => onChange(e.target.value)}
                ref={inputRef}
                style={customStyle}
            />
            {errorMessage && <span className="custom-text-input-error">{errorMessage}</span>}
        </div>
    )
}

export default CustomTextInput;