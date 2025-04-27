import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCardsForSelection, fetchUserCardsRanking } from "../redux/slices/cardsSlice";
import UserCard from "../components/UserCard";
import Select from "../components/Select";

const Wallet = () => {
    const dispatch = useDispatch();
    const { cards, selectionCards, loading, error } = useSelector((state) => state.cards);
    const [ cardId, setCardId ] = useState(null);

    useEffect(() => {
        dispatch(fetchUserCardsRanking({ user_id: 'test@test.com', category: 'all', redeem_method: 'cashback' }));
        dispatch(fetchCardsForSelection());
    }, [dispatch]);
    
    console.log(cards);
    console.log(selectionCards);

    return (
        <div className="min-h-screen w-screen p-4">
            <h1 className="text-3xl font-bold mb-4">Your cards</h1>

            {/* Loading and Error States */}
            {loading && <p>Loading cards...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {/* Cards Display */}
            {!loading && cards.length > 0 ? (
                <div className="flex flex-wrap justify-center">
                    {cards.map((card) => (
                        <UserCard key={card.card_id} card={card} />
                    ))}
                </div>
            ) : (
                !loading && <p className="text-gray-500">No cards available to display.</p>
            )}

            <h1 className="text-3xl font-bold mb-4 mt-8">Add card</h1>

            {!loading && selectionCards.length > 0 ? (
            <div>
                <Select methods={selectionCards} selected={cardId} setSelected={setCardId} label={"Choose new card"}/>
            </div>
            ) : (
                !loading && <p className="text-gray-500">No cards available to display.</p>
            )}
        </div>
    );
}

export default Wallet;