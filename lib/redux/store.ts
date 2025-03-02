import { configureStore } from '@reduxjs/toolkit';
import meetingsReducer from './features/meetings/meetingsSlice';

export const store = configureStore({
	reducer: {
		meetings: meetingsReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
