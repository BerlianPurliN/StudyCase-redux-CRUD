import { configureStore, combineReducers } from "@reduxjs/toolkit";
import postsSlice from "./slices/postSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};


const rootReducer = combineReducers({
  posts: postsSlice,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
});


export const persistor = persistStore(store);

export default store;
