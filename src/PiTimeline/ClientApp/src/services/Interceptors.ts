import { AxiosInstance } from "axios";
import { toast } from 'react-toastify';
import store from '../store';
import { setLoadingBarProgress } from './loading-reducer';

export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(
    config => {
      const i = Math.floor(Math.random() * 40) + 10;
      store.dispatch(setLoadingBarProgress(i));
      return config;
    })

  axiosInstance.interceptors.response.use(
    config => {
      store.dispatch(setLoadingBarProgress(100));
      return config
    },
    error => {
      console.log(error)

      toast.error(error.response.message)

      return Promise.reject(error);
    });
  return axiosInstance;
}