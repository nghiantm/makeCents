import { useState } from "react";
import Select from "../components/Select";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendationCards } from "../redux/slices/cardsSlice";

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

const files = [
    {
        id: 'bofa_statement_april_2025.pdf',
        name: 'BofA - April 2025',
    },
    {
        id: 'bofa_statement_march_2025.pdf',
        name: 'BofA - March 2025',
    },
]

const Recommend = () => {
    const dispatch = useDispatch();
    const [redeemMethod, setRedeemMethod] = useState(null);
    const [file, setFile] = useState(null);
    const { recommendCards, loading, error } = useSelector((state) => state.cards);
    console.log("recommendCards", recommendCards);
    const [geminiLoading, setGeminiLoading] = useState(false);

    const handleSubmit = () => {
        setGeminiLoading(true);

        // Simulate a 2-second delay
        setTimeout(() => {
            setGeminiLoading(false);
        }, 2000);
        // Call the API to get recommendations
        dispatch(fetchRecommendationCards({ redeem_method: redeemMethod.id }))
    } 

    return (
        <>
            {/* Select Component */}
            <div className="box-input flex flex-wrap gap-6 mb-10 w-64">
                {/* Category Dropdown */}
                <div className="glass-select flex flex-col  w-[15rem]">
                    <label className="select-label mb-2 ">Redeem Method</label>
                    <Select methods={methods} selected={redeemMethod} setSelected={setRedeemMethod} />
                </div>

                {/* Redeem Method Dropdown */}
                <div className="glass-select flex flex-col  w-[15rem]">
                    <label className="select-label mb-2">File</label>
                    <Select methods={files} selected={file} setSelected={setFile} />
                </div>
                {/* <Select methods={categories} selected={category} setSelected={setCategory} label={"Category"} />
                <Select methods={methods} selected={redeemMethod} setSelected={setRedeemMethod} label={"Redeem Method"} /> */}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!redeemMethod || !file || loading}
                className={`mt-4 px-4 py-2 rounded button-submit  ${
                    redeemMethod && file ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`} 
            >
                {geminiLoading ? "Calculating..." : "Calculate"}
            </button>
        </>
    )
}

export default Recommend;