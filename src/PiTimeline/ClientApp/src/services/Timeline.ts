import axios from 'axios';
import { Timeline } from '.';
import { setupInterceptorsTo } from './Interceptors';

const instance = axios.create({
  baseURL: '',
  headers: {
    'content-type': 'application/json'
  }
})

setupInterceptorsTo(instance);

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
  createTimeline: (timeline: Timeline) => instance({
    method: 'POST',
    url: `api/timelines`,
    data: timeline
  }),
  updateTimeline: (timeline: Timeline) => instance({
    method: 'PUT',
    url: `api/timelines/${timeline.id}`,
    data: timeline
  })
}