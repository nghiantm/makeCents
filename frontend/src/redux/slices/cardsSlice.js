import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCards, getCardsForSelection, getUserCardsRanking, addUserCard, deleteUserCard, getUserCards } from '../../api/apiClient';

// Thunk for fetching all cards
export const fetchAllCards = createAsyncThunk(
    'cards/fetchAllCards',
    async ({ category, redeem_method }, thunkAPI) => {
        try {
            const data = await getAllCards(category, redeem_method);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for fetching user-specific card rankings
export const fetchUserCardsRanking = createAsyncThunk(
    'cards/fetchUserCardsRanking',
    async ({ user_id, category, redeem_method }, thunkAPI) => {
        try {
            const data = await getUserCardsRanking(user_id, category, redeem_method);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for fetching cards for selection
export const fetchCardsForSelection = createAsyncThunk(
    'cards/fetchCardsForSelection',
    async (_, thunkAPI) => {
        try {
            const data = await getCardsForSelection();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteUserCardThunk = createAsyncThunk(
    'cards/deleteUserCardThunk',
    async ({ user_id, card_id }, thunkAPI) => {
        try {
            await deleteUserCard(user_id, card_id); // Call the API function
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); // Handle errors
        }
    }
);

// Thunk for adding a user card
export const addUserCardThunk = createAsyncThunk(
    'cards/addUserCardThunk',
    async ({ user_id, card_id }, thunkAPI) => {
        try {
            console.log("REDUCT: Adding card with ID:", card_id);
            await addUserCard(user_id, card_id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchUserCards = createAsyncThunk(
    'cards/fetchUserCards',
    async ({user_id}, thunkAPI) => {
        try {
            const data = await getUserCards(user_id); // Call the API function
            return data; // Return the fetched cards
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message); // Handle errors
        }
    }
);

const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: [],
        userCards: [], // Add a new state for user cards
        selectionCards: [], // Add a new state for cards used in selection
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchAllCards
            .addCase(fetchAllCards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCards.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = action.payload.data; // Ensure this matches the API response structure
            })
            .addCase(fetchAllCards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetchUserCardsRanking
            .addCase(fetchUserCardsRanking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCardsRanking.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = action.payload.data; // Ensure this matches the API response structure
            })
            .addCase(fetchUserCardsRanking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetchCardsForSelection
            .addCase(fetchCardsForSelection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCardsForSelection.fulfilled, (state, action) => {
                state.loading = false;
                state.selectionCards = action.payload.data; // Store the fetched cards for selection
            })
            .addCase(fetchCardsForSelection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle addUserCardThunk
            .addCase(addUserCardThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUserCardThunk.fulfilled, (state) => {
                state.loading = false;
                // Optionally update state if needed
            })
            .addCase(addUserCardThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteUserCardThunk
            .addCase(deleteUserCardThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserCardThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted card from the `cards` array
                //state.cards = state.cards.filter((card) => card.card_id !== action.payload);
            })
            .addCase(deleteUserCardThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            })

            // Handle fetchUserCards
            .addCase(fetchUserCards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCards.fulfilled, (state, action) => {
                state.loading = false;
                state.userCards = action.payload.data; // Update the cards state with the fetched data
            })
            .addCase(fetchUserCards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store the error message
            });
    },
});


export default cardsSlice.reducer;