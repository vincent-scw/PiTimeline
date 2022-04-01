import { Timeline } from '.';
import instance from './axios-instance';

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