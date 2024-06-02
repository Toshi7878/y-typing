import { createSlice } from "@reduxjs/toolkit";

export const playingSlice = createSlice({
  name: "playing",
  initialState: {
    value: false,
  },
  reducers: {
    startPlaying: (state) => {
      state.value = true;
    },
    stopPlaying: (state) => {
      state.value = false;
    },
  },
});

export const { startPlaying, stopPlaying } = playingSlice.actions;

export default playingSlice.reducer;
