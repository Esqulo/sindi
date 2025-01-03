import React from 'react';
import "./styles.css";

function Chevron({turn=0}){
    return(
        <p>Chevron (top) <span class="chevron"></span></p>
    )  
    // <span class="custom-chevron" style={{transform: `rotate(${turn}deg)`}}></span>
}

export default Chevron