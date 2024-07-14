// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: "",
    email: "",
    photo: "",
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.photo = action.payload.photo;
        },
        updateUser(state, action) {
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
    },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
