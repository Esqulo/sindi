import React, { useState, useRef, useCallback} from "react";
import "./styles.css";


function CustomRadioContainer({fields, groupName, onChangeAction, errorMessage, customStyle}) {
    // eslint-disable-next-line
    const [selectedField, setSelectedField] = useState("");
    const radioGroupRef = useRef(null);

    const handleChange = useCallback((event) => {
        setSelectedField(event.target.value);
        if(onChangeAction) onChangeAction();
    }, [setSelectedField, onChangeAction]);
    
    return(
        <div className="custom-radio-container" ref={radioGroupRef} style={customStyle}>
            <div className="custom-radio-container-inputs">
                {Object.entries(fields).map(
                    ([name, field])=>{
                        return (
                            <label className="custom-radio-input" htmlFor={name} key={name}>
                                <input id={name} name={groupName} type="radio" value={field.value} onChange={handleChange} disabled={field.disabled}/>
                                <span className="custom-radio-input-checkmark"></span>
                                <span className="custom-radio-input-text">{field.label}</span>
                            </label>
                        )
                    }
                )}
            </div>
            {errorMessage &&
                <span className="custom-radio-container-error_message">{errorMessage}</span>
            }
        </div>
    );
}

export default CustomRadioContainer;