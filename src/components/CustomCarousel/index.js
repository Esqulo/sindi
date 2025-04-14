import React, { useRef } from "react";
import './styles.css';

const CustomCarousel = ({ items, title }) => {

    const carouselRef = useRef(null);

    function slideLeft(){
        if (carouselRef.current) {
            const scrollAmount = carouselRef.current.scrollWidth * 0.8;
            carouselRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    function slideRight(){
        if (carouselRef.current) {
            const scrollAmount = carouselRef.current.scrollWidth * 0.8;
            carouselRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    return (
        <div className="custom_carousel-container">
            {title &&
                <span className="custom_carousel-title">{title}</span>
            }
            <div className="custom_carousel-wrapper row-centered">
                
                <button className="custom_carousel-button left" onClick={slideLeft}>❮</button>
                <button className="custom_carousel-button right" onClick={slideRight}>❯</button>

                <div className="custom_carousel-items row-centered" ref={carouselRef}>
                    {items.map((item, index) => (
                        <div key={index} className="custom_carousel-item column-centered">
                            <img src={item.image} alt={item.name} />
                            <span className="custom_carousel_card-text">{item.name}</span>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default CustomCarousel;