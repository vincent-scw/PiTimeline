import { combineReducers, createStore } from 'redux';
import { loadingReducer } from './services';

const store = createStore(combineReducers({ loadingReducer }));

export default store;