import { Moment } from '.';
import instance from './axios-instance';

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