import React from 'react';
import './Card.css'; // Make sure you import your styling

function formatKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const CardPerks = ({ perks }) => {
  if (!perks || Object.keys(perks).length === 0) {
    return null;
  }

  return (
    <div className="card-perks">
      <h3 className="card-perks-title">Perks:</h3>
      <ul className="card-perks-list">
        {Object.entries(perks).map(([key, value], index) => (
          <li key={index}>
            <span className="card-perk-key">{formatKey(key)}:</span> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardPerks;
