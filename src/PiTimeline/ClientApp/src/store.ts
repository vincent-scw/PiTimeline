import { configureStore } from '@reduxjs/toolkit';
import gallerySlice from './services/gallery-slice';
import loadingReducer from './services/loading-slice';

export default configureStore({
  reducer: {
    loading: loadingReducer,
    gallery: gallerySlice
  }
})