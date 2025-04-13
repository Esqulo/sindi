import React from "react";
import './styles.css';
import avatar from '../../../assets/images/profile/person/person1.jpg'

const reviews = [
  {
    name: "José Ricardo",
    location: "Rio de Janeiro, Brasil",
    rating: 5,
    date: "7 dias atrás",
    comment:
      "Profissional competente e extremamente capacitado. Sempre disponível para tirar dúvidas e responder rapidamente sobre qualquer questionamento. Recomendo muito!",
    image: avatar // Certifique-se de que a imagem está no diretório correto
  },
  {
    name: "José Ricardo",
    location: "Rio de Janeiro, Brasil",
    rating: 5,
    date: "7 dias atrás",
    comment:
      "Profissional competente e extremamente capacitado. Sempre disponível para tirar dúvidas e responder rapidamente sobre qualquer questionamento. Recomendo muito!",
    image: avatar
  },
  {
    name: "José Ricardo",
    location: "Rio de Janeiro, Brasil",
    rating: 5,
    date: "7 dias atrás",
    comment:
      "Profissional competente e extremamente capacitado. Sempre disponível para tirar dúvidas e responder rapidamente sobre qualquer questionamento. Recomendo muito!",
    image: avatar
  },
  {
    name: "José Ricardo",
    location: "Rio de Janeiro, Brasil",
    rating: 5,
    date: "7 dias atrás",
    comment:
      "Profissional competente e extremamente capacitado. Sempre disponível para tirar dúvidas e responder rapidamente sobre qualquer questionamento. Recomendo muito!",
    image: avatar
  },
];

const StarIcon = () => <span className="star-icon">★</span>;

const Comments = () => {
  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2 className="rating-score">4.89 🏅</h2>
        <h3>Preferido dos condôminos</h3>
        <p>Um dos profissionais com maior número de avaliações positivas na sindi</p>
      </div>

      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <img
              src={review.image}
              alt={review.name}
              className="review-image"
            />
            <div className="review-content">
              <h4>{review.name}</h4>
              <p className="review-location">{review.location}</p>
              <div className="review-rating">
                {Array(review.rating).fill(0).map((_, i) => (
                  <StarIcon key={i} />
                ))}
                <span className="review-date">• {review.date}</span>
              </div>
              <p className="review-text">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="show-more-button">Mostrar mais comentários</button>
    </div>
  );
};

export default Comments;
