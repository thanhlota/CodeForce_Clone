
import { createSlice } from '@reduxjs/toolkit';
import storageHelper from '@/utils/localStorage';

const initialState = {
    id: 1,
    username: null,
    accessToken: null,
};



const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
            storageHelper.setUser({
                id: action.payload.id,
                username: action.payload.username,
                accessToken: action.payload.accessToken
            })
        },
        logout: (state) => {
            state.id = null;
            state.username = null;
            state.accessToken = null;
        },
        initUser: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.accessToken = action.payload.accessToken;
        }
    },
});

export const { loginSuccess, logout, initUser } = userSlice.actions;
export const accessTokenSelector = (state) => state.user.accessToken
export const userNameSelector = (state) => state.user.username;
export const userIdSelector = (state) => state.user.id;


export default userSlice.reducer;
