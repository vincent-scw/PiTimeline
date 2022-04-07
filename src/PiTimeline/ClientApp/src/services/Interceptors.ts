import { AxiosInstance } from "axios";
import { toast } from 'react-toastify';
import store from '../store';
import { setLoadingProgress } from './loading-slice';

export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(
    config => {
      const i = Math.floor(Math.random() * 40) + 10;
      store.dispatch(setLoadingProgress(i));
      return config;
    })

  axiosInstance.interceptors.response.use(
    config => {
      store.dispatch(setLoadingProgress(100));
      return config
    },
    error => {
      console.log(error)

      toast.error(error.response.message)

      return Promise.reject(error);
    });
  return axiosInstance;
}