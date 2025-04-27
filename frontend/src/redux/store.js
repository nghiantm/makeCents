import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './slices/cardsSlice'; // Import your cards reducer

export const store = configureStore({
    reducer: {
        cards: cardsReducer, // Assuming you have a cardsReducer
    },
});