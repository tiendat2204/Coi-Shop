// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { cartPersistMiddleware } from '../middlewares/cartPersistMiddleware';

const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(cartPersistMiddleware),
});

export default store;
