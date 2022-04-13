import axios, { AxiosRequestTransformer } from 'axios';
import moment from 'moment';

const dateTransformer: AxiosRequestTransformer = data => {
  if (data instanceof Date) {
    return moment(data).format('YYYY-MM-DD')
  }
  if (Array.isArray(data)) {
    return data.map(val => dateTransformer(val))
  }
  if (typeof data === "object" && data !== null) {
    return Object.entries(data).reduce((acc, [ key, val ]) => {
      acc[key] = dateTransformer(val);
      return acc;
    }, {});
  }
  return data
}

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json',
  },
  transformRequest: [dateTransformer].concat(axios.defaults.transformRequest)
})

export default instance;