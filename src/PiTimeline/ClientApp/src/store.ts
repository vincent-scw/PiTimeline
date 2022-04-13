import { configureStore } from '@reduxjs/toolkit';
import { loadingReducer } from './services/loading-slice';
import { galleryReducer } from './services/gallery-slice';
import { timelineListReducer } from './services/timelineList-slice';
import { timelineReducer } from './services/timeline-slice';
import { accountReducer } from './services/account-slice';

export default configureStore({
  reducer: {
    loading: loadingReducer,
    account: accountReducer,
    timelineList: timelineListReducer,
    timeline: timelineReducer,
    gallery: galleryReducer
  }
})