import { createSlice } from "@reduxjs/toolkit";

export interface Line {
  time: string;

  lyrics: string;

  word: string;
}

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
      const newValue = [...state.value];
      newValue[Number(lineNumber)] = { time, lyrics, word };
      state.value = newValue.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    },

    deleteLine: (state, action) => {
      const lineNumber = Number(action.payload);
      state.value = state.value.filter((_, index) => index !== lineNumber);
    },
  },
});

export const { addLine, updateLine, deleteLine } = mapDataSlice.actions;
export default mapDataSlice.reducer;
