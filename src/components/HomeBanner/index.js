import React from "react";
import "./styles.css";

function HomeBanner({image}){
    return(
        <div className="homebanner-container" style={{backgroundImage: `url(${image})`}}>
        </div>
    )
}

export default HomeBanner;