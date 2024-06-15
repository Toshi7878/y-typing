import { createSlice } from "@reduxjs/toolkit";

export const tabInfoInputSlice = createSlice({
  name: "ytTitle",

  initialState: {
    videoId: "",
    title: "",
    creatorComment: "",
  },

  reducers: {
    setVideoId: (state, action) => {
      state.videoId = action.payload;
    },
    setYtTitle: (state, action) => {
      state.title = action.payload;
    },
    setCreatorComment: (state, action) => {
      state.creatorComment = action.payload;
    },
  },
});

export const { setVideoId, setYtTitle, setCreatorComment } = tabInfoInputSlice.actions;

export default tabInfoInputSlice.reducer;
