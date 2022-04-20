import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from './axios-instance';

export const fetchDir = createAsyncThunk(
  'gallery/fetchDir',
  async (path: string) => {
    const response = await instance({
      method: 'GET',
      url: path ? `api/gallery/${path}` : `api/gallery/`
    });
    
    return { data: response.data, latestDir: path };
  }
)

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState: { 
    directoryInfo: { src: '', subDirectories: [], items: [] },
    latestDir: ''
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDir.fulfilled, (state, action) => {
      state.directoryInfo = action.payload.data;
      state.latestDir = action.payload.latestDir;
    });
  }
})

export const selectDirectoryInfo = state => state.gallery.directoryInfo;
export const selectLatestDir = state => state.gallery.latestDir;
export const galleryReducer = gallerySlice.reducer;