import axios from 'axios';
import { setupInterceptorsTo } from './Interceptors';

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json'
  }
})

setupInterceptorsTo(instance);

export const GallerySvc = {
  get: (path?: string) => instance({
    method: 'GET',
    url: path ? `api/gallery/${path}` : `api/gallery/`
  })
}