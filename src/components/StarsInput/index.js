import React, { useState } from 'react';
import './styles.css';

function StarInput({ value = 0, onChange }) {
    const [hovered, setHovered] = useState(null);

    const handleClick = (starValue) => {
        onChange(starValue);
    };

    const handleMouseEnter = (starValue) => {
        setHovered(starValue);
    };

    const handleMouseLeave = () => {
        setHovered(null);
    };

    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="star-input">
            {stars.map((star) => (
                <span
                    key={star}
                    className={`star ${hovered >= star || value >= star ? 'filled' : ''}`}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default StarInput;
