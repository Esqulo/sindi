import React from "react";
import "./styles.css";

function CustomCheckInput({name, value, label, required=false, onChange, inputRef, errorMessage, customStyle}) {
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

export default CustomCheckInput;