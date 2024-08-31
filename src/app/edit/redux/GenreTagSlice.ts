import { Tag } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface GenreTag {
  tags: Array<Tag>;
}

const initialState: GenreTag = {
  tags: [],
};

export const genreTagSlice = createSlice({
  name: "genreTag",

  initialState,

  reducers: {
    setTags: (state, action) => {
      if (Array.isArray(action.payload)) {
        const tagsData = action.payload;

        state.tags = tagsData.map((tag) => ({ id: tag, text: tag, className: "" }));
      } else {
        state.tags = [...state.tags, action.payload];
      }
    },

    deleteTags: (state, action) => {
      state.tags = [...action.payload];
    },

    resetTags: (state) => {
      state.tags = initialState.tags;
    },
  },
});
export const { setTags, deleteTags, resetTags } = genreTagSlice.actions;

export default genreTagSlice.reducer;
