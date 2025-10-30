import React from "react";
import { useState, useEffect } from "react";
import "./styles.css";

import laptopFrame from "../../assets/images/landing_page/laptop.png"

function Laptop({ content = [], time = 5000 }){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        if (!content || content.length <= 1) return;

        const interval = setInterval(() => {
            setFade(false);
            
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
                setFade(true);
            }, 500);
            
        }, time);

        return () => clearInterval(interval);
    }, [content, time]);

    const currentContent = content[currentIndex];

    if (!content || content.length === 0) return null;
    return (
        <div className="laptop_container">
            <img className="laptop_frame" src={laptopFrame} alt="laptop-frame"/>
            {currentContent.type === "image" &&
                <img className={`laptop_screen ${fade ? 'fade-in' : 'fade-out'}`} src={currentContent.media} alt="laptop-screen" />
            }
            {currentContent.type === "video" &&
                <video className={`laptop_screen ${fade ? 'fade-in' : 'fade-out'}`} src={currentContent.media} muted={true} autoPlay={true} loop playsInline controls={false}/>
            }
            {currentContent.type === "embed" &&
                <iframe className={`laptop_screen ${fade ? 'fade-in' : 'fade-out'}`} src={currentContent.media} frameborder="0" allow="autoplay; encrypted-media;" referrerpolicy="strict-origin-when-cross-origin" title="laptop_screen"></iframe>
            }
        </div>
    );
}

export default Laptop;