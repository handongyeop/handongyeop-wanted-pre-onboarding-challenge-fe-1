import { createSlice } from '@reduxjs/toolkit';

const DetailSlice = createSlice({
  name: 'detail',
  initialState: {
    id: '',
    title: '',
    content: '',
    createdAt: '',
    updatedAt: '',
    isUp: false,
    inOpen: false,
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setDetail: (state, action) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
    setIsUp: (state, action) => {
      state.isUp = action.payload;
    },
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
export const detailAction = DetailSlice.actions;
export const detailReducer = DetailSlice.reducer;
