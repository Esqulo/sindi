import React from "react";
import "./styles.css";

function CustomTextInput({name, label, placeholder, type="text", required=false, onChange, inputRef, errorMessage, customStyle}) {
    return (
        <div className="custom-text-input">
            <label className="custom-text-input-label">{label}</label>
            <input className="custom-text-input-field" name={name} type={type} placeholder={placeholder} required={required} onChange={(e) => onChange(e.target.value)} ref={inputRef}/>
            {errorMessage && <span className="custom-text-input-error">{errorMessage}</span>}
        </div>
    )
}

export default CustomTextInput;