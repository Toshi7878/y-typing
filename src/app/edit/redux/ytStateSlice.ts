import { createSlice } from "@reduxjs/toolkit";

export const YTStateSlice = createSlice({
  name: "YTState",
  initialState: {
    isReady: false,
    isStarted: false,
    isPlaying: false,
  },
  reducers: {
    setIsReady: (state, action) => {
      state.isReady = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setIsStarted: (state, action) => {
      state.isStarted = action.payload;
    },
  },
});

export const { setIsReady, setIsPlaying, setIsStarted } = YTStateSlice.actions;

export default YTStateSlice.reducer;
