import React from "react";
import "./styles.css";

function LoadingIcon({size = 30, color = "#FFF"}){
    return <span class="loader" style={{
        "--loader-size": `${size}px`,
        "--loader-border": `${size / 7.5}px`,
        "--loader-color": color,
        width: `${size}px`,
        height: `${size}px`,
    }}></span>
}

export default LoadingIcon;