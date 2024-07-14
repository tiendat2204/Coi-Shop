import { createSlice } from "@reduxjs/toolkit";

const persistedCartItems = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const initialState = {
  items: persistedCartItems,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item._id === action.payload._id && item.size === action.payload.size
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      const { _id, size } = action.payload;
      state.items = state.items.filter((item) => item._id !== _id || item.size !== size);
    },
    adjustQuantity: (state, action) => {
      const { _id, size, quantity } = action.payload;
      const existingItem = state.items.find((item) => item._id === _id && item.size === size);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, adjustQuantity ,clearCart} = cartSlice.actions;

export default cartSlice.reducer;
