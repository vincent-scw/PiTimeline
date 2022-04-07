import { configureStore } from '@reduxjs/toolkit';
import gallerySlice from './services/gallery-slice';
import loadingReducer from './services/loading-slice';
import timelineListSlice from './services/timelineList-slice';
import timelineSlice from './services/timeline-slice';

export default configureStore({
  reducer: {
    loading: loadingReducer,
    gallery: gallerySlice,
    timelineList: timelineListSlice,
    timeline: timelineSlice
  }
})