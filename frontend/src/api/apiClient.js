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

export const getUserCardsRanking = async (user_id, category, redeem_method) => {
    return myAxios.get('/user/card/ranking', {
        params: {
            user_id: user_id,
            category: category,
            redeem_method: redeem_method
        }
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching user cards ranking:", error);
        throw error;
    });
}

export const getCardsForSelection = async () => {
    return myAxios.get('/card')
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching cards for selection:", error);
        throw error;
    });
}