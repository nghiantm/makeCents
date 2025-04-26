import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCards } from '../../api/apiClient';

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

const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCards.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = action.payload.data;
            })
            .addCase(fetchAllCards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.data;
            });
    },
});

export default cardsSlice.reducer;