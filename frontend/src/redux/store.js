import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice'; // Import your reducers here

export const store = configureStore({
    reducer: {
        counter: counterReducer, // Add your reducers here
    },
});