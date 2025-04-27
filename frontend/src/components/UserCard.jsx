import React from 'react';

const UserCard = ({ card, handleDelete }) => {
    return (
        <div className="border rounded-lg shadow-md p-4 m-2 w-full max-w-sm">
            {/* Card Image */}
            {card.img_url && (
                <img
                    src={card.img_url}
                    alt={card.card_name}
                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
            )}

            {/* Card Details */}
            <h2 className="text-xl font-bold">{card.card_name}</h2>
            <p className="text-sm text-gray-600">Type: {card.card_type}</p>
            <p className="text-sm text-gray-600">Rank: {card.rank}</p>
            <p className="text-sm text-gray-600">
                Reward Equivalent: {card.reward_equiv}
            </p>
            
            <p className="text-sm text-blue-600">
                Point Multiplier: {card.date_added}
            </p>
            

            <div className="border p-4 rounded shadow-md m-2">
                <h2 className="text-lg font-bold">{card.name}</h2>
                <p>{card.description}</p>
                <button
                    onClick={() => handleDelete(card.card_id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UserCard;