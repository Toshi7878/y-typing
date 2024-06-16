import { createSlice } from "@reduxjs/toolkit";

export const tabIndexSlice = createSlice({
  name: "tabIndex",
  initialState: {
    value: 0,
  },
  reducers: {
    setTabIndex: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTabIndex } = tabIndexSlice.actions;

export default tabIndexSlice.reducer;
