import moment from "moment";
import * as Svc from '../../services';

export type GroupedMoments = {
  group: string;
  moments: Svc.Moment[];
}

const groupByDate = (data, key) => {
  return data.reduce(function (prev, cur) {
    const dateKey = moment(cur[key]).format('MMM YYYY');
    (prev[dateKey] = prev[dateKey] || []).push(cur);
    return prev;
  }, {});
};

export const MomentsGroupingHandler = {
  groupMoments: (moments: Svc.Moment[]): GroupedMoments[] => {
    const groupedByDate = groupByDate(moments, 'takePlaceAtDateTime');

    let result = [];
    Object.keys(groupedByDate).forEach(g => {
      result.push({ group: g, moments: groupedByDate[g] })
    })
    return result;
  }
}