import React from 'react';
import './styles.css';

function Stars({ stars = 0, size = 24, color = "#FFD700" }) {
    const ratingValue = Math.max(0, Math.min(5, stars));

    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.25 && ratingValue % 1 < 0.75;
    const hasQuarterStar = ratingValue % 1 > 0 && ratingValue % 1 < 0.25;
    const hasThreeQuarterStar = ratingValue % 1 >= 0.75 && ratingValue % 1 < 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) - (hasQuarterStar ? 1 : 0) - (hasThreeQuarterStar ? 1 : 0);

    return (
        <span className="stars-container" style={{ fontSize: `${size}px`, color }}>
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="star-icon full">★</span>
            ))}

            {hasQuarterStar && (
                <span className="star-icon quarter">
                    <span className="star-overlay" style={{ width: '25%' }}>★</span>
                    <span className="star-bg">☆</span>
                </span>
            )}

            {hasHalfStar && (
                <span className="star-icon half">
                    <span className="star-overlay" style={{ width: '50%' }}>★</span>
                    <span className="star-bg">☆</span>
                </span>
            )}

            {hasThreeQuarterStar && (
                <span className="star-icon three-quarter">
                    <span className="star-overlay" style={{ width: '75%' }}>★</span>
                    <span className="star-bg">☆</span>
                </span>
            )}

            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="star-icon empty">☆</span>
            ))}

            <span className="star-value">{ratingValue.toFixed(2)}</span>
        </span>
    );
}

export default Stars;