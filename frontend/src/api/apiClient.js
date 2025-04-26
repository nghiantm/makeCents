import { myAxios } from "./myAxios";

export const getAllCards = async (category, redeem_method) => {
    return myAxios.get('/card/ranking', {
        params: {
            category: category,
            redeem_method: redeem_method
        }
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching all cards:", error);
        throw error;
    });
}