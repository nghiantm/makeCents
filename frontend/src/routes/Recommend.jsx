import { useState } from "react";
import Select from "../components/Select";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendationCards } from "../redux/slices/cardsSlice";
import { CheckIcon } from "@heroicons/react/20/solid";

const methods = [
  { id: "cashback", name: "Cash Back" },
  { id: "travel", name: "Travel" },
  { id: "giftcard", name: "Gift Card" },
];

const files = [
  { id: "bofa_statement_april_2025.pdf", name: "BofA - April 2025" },
  { id: "bofa_statement_march_2025.pdf", name: "BofA - March 2025" },
];

const Recommend = () => {
  const dispatch = useDispatch();
  const [redeemMethod, setRedeemMethod] = useState(null);
  const [file, setFile] = useState(null);
  const { recommendCards, loading, error } = useSelector((state) => state.cards);
  const [geminiLoading, setGeminiLoading] = useState(false);

  const handleSubmit = () => {
    setGeminiLoading(true);
    setTimeout(() => {
      setGeminiLoading(false);
    }, 2000);
    dispatch(fetchRecommendationCards({ redeem_method: redeemMethod.id }));
  };

  return (
    <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8 rounded-2xl">
      {/* Selection Section */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <div className="glass-select flex flex-col w-[15rem]">
          <label className="select-label mb-2">Redeem Method</label>
          <Select methods={methods} selected={redeemMethod} setSelected={setRedeemMethod} />
        </div>

        <div className="glass-select flex flex-col w-[15rem]">
          <label className="select-label mb-2">File</label>
          <Select methods={files} selected={file} setSelected={setFile} />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mb-20">
        <button
          onClick={handleSubmit}
          disabled={!redeemMethod || !file || loading}
          className={`px-6 py-3 rounded button-submit ${
            redeemMethod && file ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {geminiLoading ? "Calculating..." : "Calculate Recommendations"}
        </button>
      </div>

      {/* Recommendation Cards */}
      {recommendCards.length > 0 && (
        <>
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-5xl font-bold gradient-text">Recommended Cards for You</h2>
            <p className="mt-4 text-lg regular-text">
              Based on your spending habits and preferences
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            {recommendCards.slice(0, 3).map((card, index) => (
              <div
                key={card.card_id}
                className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 ring-1 ring-white/20 hover:ring-indigo-400 transition shadow-lg flex flex-col items-center"
              >
                {/* Card Image */}
                <img
                  src={card.img_url}
                  alt={card.card_name}
                  className="w-full h-40 object-cover rounded-xl mb-6"
                />

                {/* Card Info */}
                <h3 className="text-xl font-bold gradient-text text-center mb-2">{card.card_name}</h3>

                {/* Net Savings */}
                <p className="text-sm announcement-text text-center mb-2">
                  Net Savings: ${card.net_savings?.toFixed(2)}
                </p>

                {/* Rank */}
                <div className="text-md font-bold text-indigo-400 mb-4">
                  {index === 0 ? "🏆 1st" : index === 1 ? "🥈 2nd" : "🥉 3rd"}
                </div>

                {/* Perks Preview */}
                <ul className="text-sm space-y-2 mb-6">
                {card.perks && Object.keys(card.perks).slice(0, 3).map((perkKey) => (
                <li key={perkKey} className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 mt-1 text-indigo-400 flex-shrink-0" aria-hidden="true" />
                    <span className="text-left">{card.perks[perkKey]}</span>
                </li>
                ))}
                </ul>


              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recommend;
