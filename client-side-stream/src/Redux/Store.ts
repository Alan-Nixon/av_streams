import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './authenticationRedux';
import sideBarRedux from './sideBarRedux';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    sideBarRedux
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
