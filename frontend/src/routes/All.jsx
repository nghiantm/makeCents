import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCards } from '../redux/slices/cardsSlice';
import Card from '../components/Card';

const All = () => {
    const dispatch = useDispatch();
    const { cards, loading, error } = useSelector((state) => state.cards);
    console.log(cards);

    useEffect(() => {
        dispatch(fetchAllCards({ category: 'all', redeem_method: 'cashback' }));
    }, [dispatch]);

    return loading ? (<p>Loading</p>) : (
        <div className="w-screen p-4">
            <h1 className="text-3xl font-bold mb-4 question-heading">Explore<br />  All Cards <br /></h1>
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