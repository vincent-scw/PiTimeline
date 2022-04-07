import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './services/loading-slice';
import galleryReducer from './services/gallery-slice';
import timelineListReducer from './services/timelineList-slice';
import timelineReducer from './services/timeline-slice';

export default configureStore({
  reducer: {
    loading: loadingReducer,
    gallery: galleryReducer,
    timelineList: timelineListReducer,
    timeline: timelineReducer
  }
})