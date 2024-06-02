import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  number: "",
  time: "",
  lyrics: "",
  word: "",
};

export const selectLineSlice = createSlice({
  name: "selectLine",

  initialState,

  reducers: {
    setLineNumber: (state, action: PayloadAction<string>) => {
      state.number = action.payload;
    },

    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },

    setLyrics: (state, action: PayloadAction<string>) => {
      state.lyrics = action.payload;
    },

    setWord: (state, action: PayloadAction<string>) => {
      state.word = action.payload;
    },
  },
});

export const { setLineNumber, setTime, setLyrics, setWord } =
  selectLineSlice.actions;

export default selectLineSlice.reducer;
