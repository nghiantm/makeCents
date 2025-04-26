import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice'; // Import your reducers here
import cardsReducer from './slices/cardsSlice'; // Import your cards reducer

export const store = configureStore({
    reducer: {
        counter: counterReducer, // Add your reducers here
        cards: cardsReducer, // Assuming you have a cardsReducer
    },
});