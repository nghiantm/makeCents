import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCards } from '../redux/slices/cardsSlice';
import Card from '../components/Card';
import Select from '../components/Select';

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

const All = () => {
    const dispatch = useDispatch();
    const { cards, loading, error } = useSelector((state) => state.cards);
    const [redeemMethod, setRedeemMethod] = React.useState(methods[0]);
    const [category, setCategory] = React.useState(categories[0]);
    

    useEffect(() => {
        if (category && redeemMethod) {
            console.log("category", category);
            console.log("redeemMethod", redeemMethod);
            dispatch(fetchAllCards({ category: category.id, redeem_method: redeemMethod.id }));
        }
    }, [dispatch, redeemMethod, category]);

    return loading ? (<p>Loading</p>) : (
        <div className="w-screen p-4">
            <h1 className="text-3xl font-bold mb-4 question-heading">Explore<br />  All Cards <br /></h1>

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

            {loading && <p>Loading cards...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            <div className="flex flex-wrap justify-center">
                {cards.map((card) => (
                    <Card key={card.card_id} card={card} />
                ))}
            </div>
        </div>
    );
};

export default All;