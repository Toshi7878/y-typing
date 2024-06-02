import { createSlice } from "@reduxjs/toolkit";

export const mapDataSlice = createSlice({
  name: "mapData",
  initialState: {
    value: [{ time: "0", lyrics: "", word: "" }],
  },
  reducers: {
    addLine: (state, action) => {
      const newValue = [...state.value, action.payload].sort(
        (a, b) => parseFloat(a.time) - parseFloat(b.time)
      );
      state.value = newValue;
    },
    updateLine: (state, action) => {
      const { lineNumber, time, lyrics, word } = action.payload;
      state.value[Number(lineNumber)] = { time, lyrics, word };
    },
  },
});
export const { addLine, updateLine } = mapDataSlice.actions;

export default mapDataSlice.reducer;
