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

export const getUserCards = async (user_id) => {
    return myAxios.get('/user/card', {
        params: {
            user_id: user_id
        }
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.error("Error fetching user cards:", error);
        throw error;
    });
}

export const addUserCard = async (user_id, card_id) => {
    console.log("ACTION: Adding card with ID:", card_id);
    return myAxios.post('/user/card', {
        user_id: user_id,
        card_id: card_id
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error("Error adding user card:", error);
        throw error;
    });
}

export const deleteUserCard = async (user_id, card_id) => {
    return myAxios.delete('/user/card', {
        data: {
            user_id: user_id,
            card_id: card_id
        }
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error("Error deleting user card:", error);
        throw error;
    });
}