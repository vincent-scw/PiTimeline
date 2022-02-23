import axios from 'axios';
import { Moment } from '.';
import { setupInterceptorsTo } from './Interceptors';
setupInterceptorsTo(axios);

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json'
  }
})

export const MomentSvc = {
  createMoment: (moment: Moment) => instance({
    method: 'POST',
    url: `api/timelines/${moment.timelineId}/moments`,
    data: moment
  }),
  updateMoment: (moment: Moment) => instance({
    method: 'PUT',
    url: `api/timelines/${moment.timelineId}/moments/${moment.id}`,
    data: moment
  }),
  deleteMoment: (moment: Moment) => instance({
    method: 'DELETE',
    url: `api/timelines/${moment.timelineId}/moments/${moment.id}`
  })
}