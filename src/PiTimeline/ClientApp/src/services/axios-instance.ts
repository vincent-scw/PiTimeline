import axios from 'axios';
import { setupInterceptorsTo } from './Interceptors';

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json'
  }
})

setupInterceptorsTo(instance);

export default instance;