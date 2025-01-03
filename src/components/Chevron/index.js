import React from 'react';
import "./styles.css";

function Chevron({rotate="45deg", width="1px", size="10px", color="#000"}){
    return (
        <span 
            className="chevron"
            style={{
                '--border-width': `${width} ${width} 0 0`,
                '--size': size,
                '--rotate': rotate,
                '--color': color,
            }}
        />
    )
}

export default Chevron