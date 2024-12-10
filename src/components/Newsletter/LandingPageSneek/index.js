import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";

import LaptopScreenHome from "../../../assets/images/landing_page/laptop-images/home.png"
import LaptopScreenProfile from "../../../assets/images/landing_page/laptop-images/perfil-sindico.png"

function LandingPageSneek(){

    const [currentImage, setCurrentImage] = useState(0);
    const images = [LaptopScreenHome,LaptopScreenProfile];
    
    useEffect(() => {

        const interval = setInterval(() => {
          setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 8000);
    
        return () => clearInterval(interval);

    },[images.length]);

    return (
        <div className="sneek-container">
            <span className="sneek-title">Quer saber como está ficando? Dê uma olhadinha</span>
            <div className="sneek-laptop">
                <div className="sneek-laptopscreen" style={{backgroundImage: `url(${images[currentImage]})`}}></div>
            </div>
        </div>
    );
}

export default LandingPageSneek;