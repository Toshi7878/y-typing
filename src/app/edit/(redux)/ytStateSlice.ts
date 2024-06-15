import { createSlice } from "@reduxjs/toolkit";

export const YTStateSlice = createSlice({
  name: "YTState",
  initialState: {
    isReady: false,
    isStarted: false,
    isPlaying: false,
    speed: 1,
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
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
  },
});

export const { setIsReady, setIsPlaying, setIsStarted, setSpeed } = YTStateSlice.actions;

export default YTStateSlice.reducer;
