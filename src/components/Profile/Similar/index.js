
import React, { useState, useEffect } from "react";
import './styles.css';
import person1 from '../../../assets/images/profile/person/person1.jpg';
import person2 from '../../../assets/images/profile/person/person2.jpg';
import person3 from '../../../assets/images/profile/person/person3.jpg';
import person4 from '../../../assets/images/profile/person/person4.jpg';
import person5 from '../../../assets/images/profile/person/person5.jpg';

const Similar = () => {
  const similarSindico = [
    { id: 1, name: "Felipe de Souza", image: person1 },
    { id: 2, name: "Roberta Castro", image: person2 },
    { id: 3, name: "Ciclano Ferreira", image: person3 },
    { id: 4, name: "João Silva", image: person4 },
    { id: 5, name: "Eduardo Albuquerque", image: person5 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;  // Define dinamicamente a quantidade de itens por largura da tela

  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0); // Reseta o índice para evitar cortes ao mudar a largura
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex + itemsPerView >= similarSindico.length) {
      setCurrentIndex(0); // Volta pro início
    } else {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex === 0) {
      setCurrentIndex(similarSindico.length - itemsPerView); // Vai pro final
    } else {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  return (
    <div className="similar-container">
      <h2 className="similar-title">Síndicos Similares</h2>
      <div className="carousel-wrapper-similar">
        <button className="carousel-button left" onClick={prevSlide}>❮</button>
        <div className="carousel-wrapper-similar">

        <div
  className="carousel-items-similar"
  style={{
    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
    width: `${similarSindico.length * (100 / itemsPerView)}%`,
    display: "flex",
    transition: "transform 0.5s ease-in-out"
  }}
>
  {similarSindico.map((item, index) => (
    <div
      key={index}
      className="carousel-item-similar"
      style={{ width: `${100 / itemsPerView}%` }}
    >
      <div className="card-people-similar">
        <img src={item.image} alt={item.name} />
        <p className="card-text-similar">{item.name}</p>
      </div>
    </div>
  ))}
</div>


        </div>

        <button className="carousel-button right" onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
};

export default Similar;
