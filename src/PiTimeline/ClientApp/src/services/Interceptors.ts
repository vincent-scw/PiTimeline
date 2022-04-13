import { AxiosInstance } from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css' 
import store from '../store';
import { setLoadingProgress } from './loading-slice';

export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('access_token');
      if (token)
        config.headers['Authorization'] = `Bearer ${token}`;

      const i = Math.floor(Math.random() * 40) + 10;
      store.dispatch(setLoadingProgress(i));
      return config;
    },
    error => {
      store.dispatch(setLoadingProgress(100));
      return Promise.reject(error);
    });

  axiosInstance.interceptors.response.use(
    config => {
      store.dispatch(setLoadingProgress(100));
      return config
    },
    error => {
      console.log(error)

      toast.error(error.response.message, { position: 'bottom-center' });
      store.dispatch(setLoadingProgress(100));
      return Promise.reject(error);
    });

  return axiosInstance;
}