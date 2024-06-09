import { createSlice } from "@reduxjs/toolkit";

export const YTStateSlice = createSlice({
  name: "YTState",
  initialState: {
    isPlaying: false,
    isStarted: false,
    speed: 1,
  },
  reducers: {
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

export const { setIsPlaying, setIsStarted, setSpeed } = YTStateSlice.actions;

export default YTStateSlice.reducer;
