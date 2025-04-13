import React, { useState, useEffect } from "react";
import './styles.css';

const Portfolio = ({ portfolioItems }) => {  // Recebendo dados via props
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = Math.floor(window.innerWidth / 250); // Responsivo

  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0); // Resetar ao mudar tamanho da tela
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % portfolioItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + portfolioItems.length) % portfolioItems.length);
  };

  return (
    <div className="portfolio-container">
      <h2 className="portfolio-title">Portifólio</h2>
      <div className="carousel-wrapper">
        <button className="carousel-button left" onClick={prevSlide}>❮</button>

        <div 
          className="carousel-items"
          style={{ transform: `translateX(-${currentIndex * 100 / portfolioItems.length}%)`, width: "100%" }}
        >
          {portfolioItems.map((item, index) => (
            <div key={index} className="carousel-item" style={{ width: `${100 / itemsPerView}%` }}>
              <div className="card">
                <img src={item.image} alt={item.name} />
                <p className="card-text">{item.name}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-button right" onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
};

export default Portfolio;
