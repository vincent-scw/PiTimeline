import axios from 'axios';

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
  })
}