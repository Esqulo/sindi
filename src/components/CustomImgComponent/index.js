import React from 'react';
import "./styles.css";

function CustomImageComponent({img,width="100%",height="100%",borderRadius}){
    return <div 
        style={{
            backgroundImage: `url(${img})`,
            width,
            height,
            borderRadius
        }}
        className="custom-image-component"
    />
}

export default CustomImageComponent;