import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vacationReducer from './slices/vacationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vacations: vacationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

