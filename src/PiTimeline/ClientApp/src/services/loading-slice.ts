import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: { progress: 0 },
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    }
  }
})

export const { setProgress } = loadingSlice.actions;
export default loadingSlice.reducer;