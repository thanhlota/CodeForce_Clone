import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user.reducer';
import { createWrapper } from 'next-redux-wrapper';

const makeStore = () => {
    const store = configureStore({
        reducer: {
            user: userReducer,
        }
    })
    return store;
}

const wrapper = createWrapper(makeStore, { debug: false });

export { wrapper, makeStore };