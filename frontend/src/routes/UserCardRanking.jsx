import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCardsRanking } from '../redux/slices/cardsSlice';
import Card from '../components/Card';
import Select from '../components/Select';
import UserCard from '../components/UserCard';
import RecCard from '../components/RecCard';

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
    }, [dispatch, redeemMethod, category]);

    return (
        
        <div className=" w-screen p-4">
            <h1 className="question-heading mb-8">
                Which <br /> card should I <br /> use?
            </h1>
            <p className='regular-text'>find out the best option from your wallet</p>

            {/* Select Component */}
            <div className="box-input flex flex-wrap gap-6 mb-10 w-64">
                {/* Category Dropdown */}
                <div className="glass-select flex flex-col  w-[15rem]">
                    <label className="select-label mb-2 ">Category</label>
                    <Select methods={categories} selected={category} setSelected={setCategory} />
                </div>

                {/* Redeem Method Dropdown */}
                <div className="glass-select flex flex-col  w-[15rem]">
                    <label className="select-label mb-2">Redeem Method</label>
                    <Select methods={methods} selected={redeemMethod} setSelected={setRedeemMethod} />
                </div>
                {/* <Select methods={categories} selected={category} setSelected={setCategory} label={"Category"} />
                <Select methods={methods} selected={redeemMethod} setSelected={setRedeemMethod} label={"Redeem Method"} /> */}
            </div>

            {/* Loading and Error States */}
            {!loading && cards.length > 0 ? (
                <div className="flex flex-col items-center">

                    {/* Top Best Card */}
                    <div className="mb-12 w-full max-w-4xl">
                        <h2 className="text-xl font-bold mb-10 text-center announcement-text">✨ This is the your best card for this category!</h2>
                        <Card card={cards[0]} featured />  {/* Pass a "featured" prop to Card */}
                    </div>

                    {/* Divider Line + Message */}
                    <div className="border-t border-gray-400 w-full max-w-5xl mb-8"></div>
                    <h3 className="text-lg font-semibold mb-6 text-center announcement-text">Other options in order:</h3>

                    {/* Rest of Cards */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {cards.slice(1).map((card) => (
                            <Card key={card.card_id} card={card} showPerks={false} />
                        ))}
                    </div>

                </div>
            ) : (
                !loading && <p className="text-gray-500">No cards available to display.</p>
            )}

        </div>
    );
};

export default UserCardRanking;