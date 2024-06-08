import { createSlice } from "@reduxjs/toolkit";

export const YTStateSlice = createSlice({
  name: "YTState",
  initialState: {
    isPlaying: false,
    isStarted: false,
  },
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setIsStarted: (state, action) => {
      state.isStarted = action.payload;
    },
  },
});

export const { setIsPlaying, setIsStarted } = YTStateSlice.actions;

export default YTStateSlice.reducer;
