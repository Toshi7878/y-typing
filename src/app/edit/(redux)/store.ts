import { configureStore } from "@reduxjs/toolkit";
import playingReducer from "./playingSlice";

const store = configureStore({
  reducer: {
    playing: playingReducer,
  },
});

export default store;
