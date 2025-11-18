import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from './properties/propertiesSlice';

/**
 * Redux Store Configuration
 *
 * Central Redux store for the Million Luxury application.
 * Uses Redux Toolkit for simplified configuration.
 *
 * Available Slices:
 * - properties: Handles property listings and details
 */
export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['properties/fetchProperties/fulfilled'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});
