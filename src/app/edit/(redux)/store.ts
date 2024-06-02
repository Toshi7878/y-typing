import { configureStore } from "@reduxjs/toolkit";
import playingReducer from "./playingSlice";
import tabIndexReducer from "./tabIndexSlice";

const store = configureStore({
  reducer: {
    playing: playingReducer,
    tabIndex: tabIndexReducer,
  },
});

export default store;
