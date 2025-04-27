import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

// Fake data for now (replace later with your real API)
const recommendations = [
  {
    id: 'card1',
    name: 'Chase Sapphire Preferred',
    img_url: 'https://via.placeholder.com/300x190',  // replace with real card image later
    description: 'Great for travel rewards and flexible redemption options.',
    features: [
      '3x Points on Dining',
      '2x Points on Travel',
      'No Foreign Transaction Fees',
    ],
    href: '#',
  },
  {
    id: 'card2',
    name: 'Amex Gold Card',
    img_url: 'https://via.placeholder.com/300x190',
    description: 'Earn rewards faster on dining and groceries.',
    features: [
      '4x Points on Restaurants',
      '4x Points on Groceries',
      '$120 Dining Credit',
    ],
    href: '#',
  },
  {
    id: 'card3',
    name: 'Citi Double Cash',
    img_url: 'https://via.placeholder.com/300x190',
    description: 'Simple cashback rewards for everyday purchases.',
    features: [
      '2% Cashback on All Purchases',
      'No Annual Fee',
      'Flexible Redemption',
    ],
    href: '#',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const RecCard = () => {
  return (
    <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8 rounded-2xl ">
      
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h2 className="text-5xl font-bold gradient-text">Recommended Cards for You</h2>
        <p className="mt-4 text-lg regular-text">
          Based on your spending habits and preferences
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        {recommendations.map((card) => (
          <div
            key={card.id}
            className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 ring-1 ring-white/20 hover:ring-indigo-400 transition shadow-lg flex flex-col items-center"
          >
            {/* Card Image */}
            <img
              src={card.img_url}
              alt={card.name}
              className="w-full h-40 object-cover rounded-xl mb-6"
            />

            {/* Card Info */}
            <h3 className="text-xl font-bold gradient-text text-center mb-2">{card.name}</h3>
            <p className="text-sm text-gray-300 text-center mb-6">{card.description}</p>

            {/* Features */}
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              {card.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <a
              href={card.href}
              className="button-submit mt-auto inline-block rounded-md px-4 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 transition"
            >
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecCard;
