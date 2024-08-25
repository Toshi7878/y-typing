import { createSlice } from "@reduxjs/toolkit";

interface LineIndex {
  timeIndex: number | null;
  selectedIndex: number | null;
}

const initialState: LineIndex = {
  timeIndex: null,
  selectedIndex: null,
};
export const lineIndexSlice = createSlice({
  name: "lineIndex",
  initialState,
  reducers: {
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
    setTimeIndex: (state, action) => {
      state.timeIndex = action.payload;
    },
  },
});

export const { setSelectedIndex, setTimeIndex } = lineIndexSlice.actions;

export default lineIndexSlice.reducer;
