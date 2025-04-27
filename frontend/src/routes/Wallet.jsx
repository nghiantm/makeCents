import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUserCardThunk, deleteUserCardThunk, fetchCardsForSelection, fetchUserCards, fetchUserCardsRanking } from "../redux/slices/cardsSlice";
import UserCard from "../components/UserCard";
import Select from "../components/Select";

const Wallet = () => {
    const dispatch = useDispatch();
    const { userCards, selectionCards, loading, error } = useSelector((state) => state.cards);
    const [ cardId, setCardId ] = useState(null);

    useEffect(() => {
        dispatch(fetchUserCards({ user_id: 'test@test.com' }));
        dispatch(fetchCardsForSelection());
    }, []);

    const handleCardAdd = () => {
        if (cardId) {
            dispatch(addUserCardThunk({ user_id: 'test@test.com', card_id: cardId.id }))
            .then((response) => {
                dispatch(fetchUserCards({ user_id: 'test@test.com' }));
                setCardId(null); // Reset the selected card after adding
            })
            .catch((error) => {
                console.error("Error adding card:", error);
            });
        }
    }

    const handleDelete = (cardId) => {
        // Implement delete functionality here
        console.log("Delete card with ID:", cardId);
        dispatch(deleteUserCardThunk({ user_id: 'test@test.com', card_id: cardId }))
        .then((response) => {
            dispatch(fetchUserCards({ user_id: 'test@test.com' }));
        })
        .catch((error) => {
            console.error("Error deleting card:", error);
        });
    }

    return (
        <div className="min-h-screen w-screen p-4">
            <h1 className="text-3xl font-bold mb-4 mt-8 question-heading">Manage <br/> My Wallet <br/> </h1>
            <p className='regular-text'>Easily add or remove any card within a second </p>
            <div className ="flex justify-center">
            <div className = "glass-select w-[22rem] ">
                
            {!loading && selectionCards.length > 0 ? (
            <div className = "w-80">
                <Select 
                    methods={selectionCards} 
                    selected={cardId} 
                    setSelected={setCardId} 
                    label={"Choose a card below to add"}
                />
                <button
                    onClick={handleCardAdd}
                    disabled={!cardId || loading}
                    className={`mt-4 px-4 py-2 rounded button-submit  ${
                        cardId ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`} 
                >
                    {loading ? "Adding..." : "Add Card"}
                </button>
            </div>
            ) : (
                !loading && <p className="text-gray-500">No userCards available to display.</p>
            )}
            </div>
            </div>
            <h1 className="text-3xl font-bold pb-5 pt-10 question-heading">What's <br/> inside my wallet?</h1>

            {/* Loading and Error States */}
            {loading && <p>Loading userCards...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {/* Cards Display */}
            {!loading && userCards.length > 0 ? (
                <div className="flex flex-wrap justify-center user-card-display flex flex-col items-center gap-20">
                    {userCards.map((card) => (
                        <UserCard key={card.card_id} card={card} handleDelete={handleDelete}/>
                    ))}
                </div>
            ) : (
                !loading && <p className="text-gray-500">No userCards available to display.</p>
            )}
        </div>
    )
}

export default Wallet;