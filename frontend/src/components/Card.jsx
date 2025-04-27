import React from 'react';
import './Card.css';
import CardPerks from './CardPerks';

function formatKey(key) {
    return key
      .replace(/_/g, ' ')           // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of every word
  }
const Card = ({ card, showPerks = true  }) => {
    return (
        <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden m-4 w-full max-w-4xl p-6">
          
          {/* Top Row: Image + Info */}
          <div className="flex flex-row w-full">
            
            {/* Left: Card Image */}
            {card.img_url && (
              <div className="flex-shrink-0 w-[300px] h-[189px] mr-6 ">
                <img
                  src={card.img_url}
                  alt={card.card_name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}

            {/* Right: Card Info */}
            <div className="flex flex-col justify-center flex-1">
              <h2 className="text-2xl font-bold card-name mb-4 gradient-text">{card.card_name}</h2>
              <div className="flex flex-wrap gap-4 mb-4 justify-center">
                <div className="info-pill">
                  <div className="info-pill-title">Type</div>
                  <div className="info-pill-value">{card.card_type}</div>
                </div>
                <div className="info-pill">
                  <div className="info-pill-title">Rank</div>
                  <div className="info-pill-value">{card.rank}</div>
                </div>
                <div className="info-pill">
                  <div className="info-pill-title">Reward Equivalent</div>
                  <div className="info-pill-value">{card.reward_equiv}</div>
                </div>

                {card.card_type === 'cashback' && (
                  <div className="info-pill">
                    <div className="info-pill-title">Cashback</div>
                    <div className="info-pill-value">{card.cashback_pct}%</div>
                  </div>
                )}
                {card.card_type === 'point' && (
                  <div className="info-pill">
                    <div className="info-pill-title">Point Multiplier</div>
                    <div className="info-pill-value">{card.point_mul}x</div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Row: Perks */}
          {showPerks && <div className="mt-10"><CardPerks perks={card.perks} /></div>}
          {/* {card.perks && Object.keys(card.perks).length > 0 && (
            <div className="card-perks mt-6">
              <h3 className="text-base font-semibold card-perks-title mb-2">Perks:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm card-perks-list">
                {Object.entries(card.perks).map(([key, value], index) => (
                  <li key={index}>
                    <span className="font-semibold">{formatKey(key)}:</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          )} */}

        </div>
    );
};

export default Card;
