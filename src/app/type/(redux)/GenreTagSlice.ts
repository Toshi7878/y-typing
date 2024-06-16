import { Tag } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface GenreTag {
  tags: Array<Tag>;
  genre: string;
}

const initialState: GenreTag = {
  genre: "",
  tags: [],
};

export const genreTagSlice = createSlice({
  name: "genreTag",

  initialState,

  reducers: {
    setGenre: (state, action) => {
      state.genre = action.payload;
    },
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
  },
});
export const { setGenre, setTags, deleteTags } = genreTagSlice.actions;

export default genreTagSlice.reducer;
