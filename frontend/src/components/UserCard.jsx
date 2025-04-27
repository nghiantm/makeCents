import React from 'react';
import './Card.css';

const UserCard = ({ card, handleDelete }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-[300px] h-[190px] m-4">
      
      {/* Only hover trigger is the image */}
      <div className="group relative w-full h-full">
        
        {/* Card Image */}
        {card.img_url && (
          <img
            src={card.img_url}
            alt={card.card_name}
            className="w-full h-full object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:opacity-0"
          />
        )}

        {/* Hover Popup */}
        <div className="absolute top-1/2 left-1/2 w-screen max-w-4xl p-8 background-blur rounded-2xl shadow-2xl
                        transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 
                        group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-10
                        text-[#0a0b29]">

          {/* Hover Content */}
          <div className="flex flex-col md:flex-row gap-8 w-full justify-start items-start">
            
            {/* Left - Card Image */}
            {card.img_url && (
              <div className="w-[300px] h-[190px] flex-shrink-0">
                <img
                  src={card.img_url}
                  alt={card.card_name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}

            {/* Right - Card Info */}
            <div className="flex flex-col flex-1 justify-start items-center">
              <h2 className="text-2xl font-bold gradient-text mb-4 text-center">{card.card_name}</h2>

              <div className="flex flex-wrap gap-4 mb-4 justify-center">

                <div className="info-pill">
                  <div className="info-pill-title">Type</div>
                  <div className="info-pill-value">{card.card_type}</div>
                </div>

                <div className="info-pill">
                  <div className="info-pill-title">Annual Fee</div>
                  <div className="info-pill-value">
                    {card.annual_fee ? `$${card.annual_fee}` : "N/A"}
                  </div>
                </div>
{/* 
                <div className="info-pill">
                  <div className="info-pill-title">Reward Equiv</div>
                  <div className="info-pill-value">{card.reward_equiv}</div>
                </div> */}

              </div>

              <div className="regular-text mt-2 mb-4">
                {card.date_added ? `Added: ${card.date_added}` : "Added: N/A"}
              </div>

              {/* Moved Delete Button Here */}
              <button
                onClick={() => handleDelete(card.card_id)}
                className="button-submit text-sm px-6 py-2 rounded-md hover:opacity-80 transition"
              >
                Remove
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserCard;
