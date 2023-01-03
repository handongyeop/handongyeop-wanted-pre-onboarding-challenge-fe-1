import { configureStore } from '@reduxjs/toolkit';
import { detailReducer } from './reducers/DetailReducer';

const store = configureStore({
  reducer: {
    detail: detailReducer,
  },
});

export default store;
