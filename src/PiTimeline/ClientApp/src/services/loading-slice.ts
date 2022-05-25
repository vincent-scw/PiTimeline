import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: { progress: 0 },
  reducers: {
    setLoadingProgress: (state, action) => {
      state.progress = action.payload;
    }
  }
})

export const selectLoadingProgress = state => state.loading?.progress;
export const { setLoadingProgress } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;