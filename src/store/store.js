import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import userSlice from './userSlice';
import storage from 'redux-persist/lib/storage';
import {
  persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const commonConfig = {
  key: 'e-commerce/user',
  storage
}

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'id', 'email', 'isTokenValid']
}

export const store = configureStore({
  reducer: {
    app: appSlice,
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
