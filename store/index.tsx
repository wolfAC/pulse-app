// store.ts
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer, { AppState } from "./rootReducer";

const persistConfig = {
  key: "pulse-app",
  storage,
  whitelist: ["app", "goals", "health", "performance", "finance"],
};

const persistedReducer = persistReducer<AppState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = AppState;
export type AppDispatch = typeof store.dispatch;
