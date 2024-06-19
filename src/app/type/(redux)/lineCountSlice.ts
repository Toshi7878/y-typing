import { createSlice } from "@reduxjs/toolkit";

interface LineCount {
  timeCount: number;
}

const initialState: LineCount = {
  timeCount: 0,
};
export const lineCountSlice = createSlice({
  name: "lineCount",
  initialState,
  reducers: {
    setTimeCount: (state, action) => {
      state.timeCount = action.payload;
    },
  },
});

export const { setTimeCount } = lineCountSlice.actions;

export default lineCountSlice.reducer;
