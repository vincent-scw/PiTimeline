import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './services/loading-slice';

export default configureStore({
  reducer: {
    loading: loadingReducer
  }
})