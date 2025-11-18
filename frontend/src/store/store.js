import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from './properties/propertiesSlice';

// Redux Store Configuration
export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['properties/fetchProperties/fulfilled'], // Ignore these action types
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});
