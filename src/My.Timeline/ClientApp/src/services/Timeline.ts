import axios from 'axios';
import { TimelineDetail } from '.';
import { setupInterceptorsTo } from './Interceptors';
setupInterceptorsTo(axios);

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json'
  }
})

export const TimelineSvc = {
  fetchTimelines: () => instance({
    method: 'GET',
    url: '/api/timelines'
  }),
  getTimeline: (timelineId: string) => instance({
    method: 'GET',
    url: `api/timelines/${timelineId}`
  }),
  deleteTimeline: (timelineId: string) => instance({
    method: 'DELETE',
    url: `api/timelines/${timelineId}`
  }),
  createTimeline: (timeline: TimelineDetail) => instance({
    method: 'POST',
    url: `api/timelines`,
    data: timeline
  }),
  updateTimeline: (timeline: TimelineDetail) => instance({
    method: 'PUT',
    url: `api/timelines/${timeline.id}`,
    data: timeline
  })
}