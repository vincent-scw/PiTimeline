import { AxiosInstance } from "axios";
import { toast } from 'react-toastify';

export const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.response.use(config => config,
    error => {
      console.log(error)

      toast.error(error.response.message)

      return Promise.reject(error);
    });
  return axiosInstance;
}