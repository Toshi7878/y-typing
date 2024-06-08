import { createSlice } from "@reduxjs/toolkit";

export const ytTitleSlice = createSlice({
  name: "ytTitle",

  initialState: {
    title: "動画タイトル",
  },

  reducers: {
    setYtTitle: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const { setYtTitle } = ytTitleSlice.actions;

export default ytTitleSlice.reducer;
