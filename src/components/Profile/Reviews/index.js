import React from "react";
import './styles.css';
import super_sindico from '../../../assets/images/profile/super-sindico.png';
import verificado from  '../../../assets/images/profile/verificado.png';

const Reviews = () => {
  const ratings = [
    "Conhecimento da legislação condominial",
    "Gestão de finanças",
    "Conhecimento do Código Civil",
    "Gestão de manutenção predial",
    "Capacidade de coordenação de equipes",
    "Inteligência emocional",
    "Comunicação e mediação de conflitos",
  ];

  return (
    <div className="container-reviews">
      <div className="container-rating">
        <div className="title">
          <h1>Avaliações</h1>
        </div>
        <div className="rating-list">
          {ratings.map((rating, index) => (
            <div key={index} className="rating-item">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="star">★</span>
              ))}
              <span>{rating}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-container">
        <div className="card-reviews">
          <div className="price">
           <h2>R$50,00</h2>
            <span className="unit">por unidade condominial</span>
          </div>
          <div className="info-box">
            <span>Com a sindi desde 2024</span>
            <span className="verified">Identidade verificada <img src={verificado} className="verificado-img"/></span>
          </div>
          <div className="negotiation">Disponível para negociação</div>
            <button className="contact-button">Entrar em contato</button>
        </div>
        <div className="super-sindico">
          <img src={super_sindico} className="icon" />
          <div>
            <strong>Este é um <span className="highlight">SuperSíndico</span></strong>
            <p>Beltrano possui ótima reputação no mercado e excelentes avaliações.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
