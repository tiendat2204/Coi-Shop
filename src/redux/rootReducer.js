// src/redux/rootReducer.js
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";
import notificationReducer from "./notificationSlice";
import userReducer from "./userSlice";
const rootReducer = combineReducers({
  cart: cartReducer,
  notification: notificationReducer,
  user: userReducer,
});

export default rootReducer;
