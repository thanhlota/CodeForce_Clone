
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    id: null,
    username: null,
    role: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.id = null;
            state.username = null;
            state.role = null;
        },
        initUser: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.role = action.payload.role;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(HYDRATE, (state, action) => {
                return {
                    ...state,
                    ...action.payload.user,
                };
            });
    },
});

export const { loginSuccess, logout, initUser } = userSlice.actions;
export const roleSelector = (state) => state.user.role
export const userNameSelector = (state) => state.user.username;
export const userIdSelector = (state) => state.user.id;

export default userSlice.reducer;
