import { createSlice } from '@reduxjs/toolkit';

const DetailSlice = createSlice({
  name: 'detail',
  initialState: {
    id: '',
    title: '',
    content: '',
    isUp: false,
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setDetail: (state, action) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    setIsUp: (state, action) => {
      state.isUp = action.payload;
    },
  },
});
export const detailAction = DetailSlice.actions;
export const detailReducer = DetailSlice.reducer;
