import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from './axios-instance';

export const fetchDir = createAsyncThunk(
  'gallery/fetchDir',
  async (path: string) => {
    const response = await instance({
      method: 'GET',
      url: path ? `api/gallery/d/${path}` : `api/gallery/d/`
    });

    return { data: response.data, latestDir: path };
  }
)

const initialState = {
  directoryInfo: { src: '', subDirectories: [], items: [] },
  latestDir: ''
}

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDir.fulfilled, (state, action) => {
      state.directoryInfo = action.payload.data;
      state.latestDir = action.payload.latestDir;
    });
    builder.addCase(fetchDir.rejected, state => state = initialState);
  }
})

export const selectDirectoryInfo = state => state.gallery?.directoryInfo;
export const selectLatestDir = state => state.gallery?.latestDir;
export const galleryReducer = gallerySlice.reducer;