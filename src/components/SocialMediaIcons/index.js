import React from "react";
import "./styles.css";

import IgIcon from "../../assets/images/social_media_icons/instagram.png";
import InIcon from "../../assets/images/social_media_icons/linkedin.png";

function SocialMediaIcons(){
    return(
        <div className="smicons-container">
            <div className="smicons-content">
                <a href="https://www.instagram.com/sindi.brasil?igsh=c25udjVobnd1bjly" target="_blank" rel="noreferrer">
                    <div className="smicons-item">
                        <img id="instagram" src={IgIcon} alt="instagram"/>
                    </div>
                </a>
                <a href="https://br.linkedin.com/company/sindi-brasil" target="_blank" rel="noreferrer">
                    <div className="smicons-item">
                        <img id="linkedin" src={InIcon} alt="linkedin"/>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default SocialMediaIcons;