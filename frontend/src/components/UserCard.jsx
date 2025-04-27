import React from 'react';

const UserCard = ({ card }) => {
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
            {card.card_type === 'cashback' && (
                <p className="text-sm text-green-600">
                    Cashback: {card.cashback_pct}%
                </p>
            )}
            {card.card_type === 'point' && (
                <p className="text-sm text-blue-600">
                    Point Multiplier: {card.point_mul}x
                </p>
            )}
        </div>
    );
};

export default UserCard;