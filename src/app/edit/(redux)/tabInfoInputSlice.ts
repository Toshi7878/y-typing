import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoId: "",
  title: "",
  creatorComment: "",
};

export const tabInfoInputSlice = createSlice({
  name: "ytTitle",

  initialState: initialState,

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

    resetYtData: (state) => {
      state.videoId = initialState.videoId;
      state.title = initialState.title;
      state.creatorComment = initialState.creatorComment;
    },
  },
});

export const { setVideoId, setYtTitle, setCreatorComment, resetYtData } = tabInfoInputSlice.actions;

export default tabInfoInputSlice.reducer;
