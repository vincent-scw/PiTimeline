import axios, { AxiosRequestTransformer } from 'axios';
import moment from 'moment';

const dateTransformer: AxiosRequestTransformer = data => {
  if (data instanceof Date) {
    return moment(data).format('yyyy-MM-DD')
  }
  if (Array.isArray(data)) {
    return data.map(val => dateTransformer(val))
  }
  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(Object.entries(data).map(([ key, val ]) =>
      [ key, dateTransformer(val) ]))
  }
  return data
}

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json'
  },
  transformRequest: [dateTransformer].concat(axios.defaults.transformRequest)
})

export default instance;