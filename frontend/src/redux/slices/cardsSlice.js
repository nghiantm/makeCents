import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCards, getCardsForSelection, getUserCardsRanking } from '../../api/apiClient';

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

const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: [],
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
            });
    },
});

export default cardsSlice.reducer;