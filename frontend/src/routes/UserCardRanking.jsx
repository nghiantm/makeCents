import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCardsRanking } from '../redux/slices/cardsSlice';
import Card from '../components/Card';
import Select from '../components/Select';
import UserCard from '../components/UserCard';

const methods = [
    {
        id: 'cashback',
        name: 'Cash Back'
    },
    {
        id: 'travel',
        name: 'Travel'
    },
    {
        id: 'giftcard',
        name: 'Gift Card'
    },
];

const categories = [
    {
        id: 'all',
        name: 'All'
    },
    {
        id: 'dining',
        name: 'Dining'
    },
    {
        id: 'online',
        name: 'Online Shopping'
    },
    {
        id: 'travel',
        name: 'Travel & Accommodation'
    },
    {
        id: 'grocery',
        name: 'Grocery & Wholesale'
    },
    {
        id: 'pharma',
        name: 'Pharmacy'
    },
    {
        id: 'gas',
        name: 'Gas & EV Charging'
    }
]

const UserCardRanking = () => {
    const dispatch = useDispatch();
    const { cards, loading, error } = useSelector((state) => state.cards);
    const [redeemMethod, setRedeemMethod] = useState(methods[0]);
    const [category, setCategory] = useState(categories[0]);
    console.log(redeemMethod);

    useEffect(() => {
        console.log('Fetching user cards ranking...');
        dispatch(fetchUserCardsRanking({ user_id: 'test@test.com', category: category.id, redeem_method: redeemMethod.id }));
    }, [dispatch, redeemMethod]);

    return (
        <div className="h-screen w-screen p-4">
            <h1 className="text-3xl font-bold mb-4">Which card should you use?</h1>

            {/* Select Component */}
            <div className="grid grid-cols-5 mb-6 gap-4">
                <Select methods={categories} selected={category} setSelected={setCategory} label={"Category"}/>
                <Select methods={methods} selected={redeemMethod} setSelected={setRedeemMethod} label={"Redeem Method"}/>
            </div>

            {/* Loading and Error States */}
            {loading && <p>Loading cards...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {/* Cards Display */}
            {!loading && cards.length > 0 ? (
                <div className="flex flex-wrap justify-center">
                    {cards.map((card) => (
                        <Card key={card.card_id} card={card} />
                    ))}
                </div>
            ) : (
                !loading && <p className="text-gray-500">No cards available to display.</p>
            )}
        </div>
    );
};

export default UserCardRanking;