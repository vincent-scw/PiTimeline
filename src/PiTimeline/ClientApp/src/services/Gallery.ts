import axios from 'axios';
import { setupInterceptorsTo } from './Interceptors';
setupInterceptorsTo(axios);

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json'
  }
})

export const GallerySvc = {
  get: (path?: string) => instance({
    method: 'GET',
    url: path ? `api/gallery/${path}` : `api/gallery/`
  })
}