import React, { useState, useEffect } from "react";
import './styles.css';

const Certificates = ({ certificatesItems }) => {  // Recebendo os certificados do pai
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = Math.floor(window.innerWidth / 250); // Responsivo por largura da tela

  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0); // Resetar posição ao mudar largura da tela
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % certificatesItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + certificatesItems.length) % certificatesItems.length);
  };

  return (
    <div className="certificates-container">
      <h2 className="certificates-title">Certificados</h2>
      <div className="carousel-wrapper">
        <button className="carousel-button left" onClick={prevSlide}>❮</button>
        
        <div 
          className="carousel-items"
          style={{ transform: `translateX(-${currentIndex * 100 / certificatesItems.length}%)`, width: "100%" }}
        >
          {certificatesItems.map((item, index) => (
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

export default Certificates;
