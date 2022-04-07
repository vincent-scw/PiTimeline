import { createAsyncThunk, createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Moment, GroupedMoments } from ".";
import instance from './axios-instance';
import moment from "moment";

const groupByDate = (data, key) => {
  return data.reduce(function (prev, cur) {
    const dateKey = moment(cur[key]).format('MMM YYYY');
    (prev[dateKey] = prev[dateKey] || []).push(cur);
    return prev;
  }, {});
};

const groupMoments = (moments: Moment[]): GroupedMoments[] => {
  if (!moments) { return []; }
  const groupedByDate = groupByDate(moments, 'takePlaceAtDateTime');

  let result = [];
  Object.keys(groupedByDate).forEach(g => {
    result.push({ group: g, moments: groupedByDate[g] })
  })
  return result;
}

export const getTimelineDetail = createAsyncThunk(
  'timeline/getDetail',
  async (timelineId: string) => {
    const response = await instance({
      method: 'GET',
      url: `api/timelines/${timelineId}`
    });

    return response.data;
  }
)

export const createMoment = createAsyncThunk(
  'timeline/createMoment',
  async (moment: Moment) => {
    const response = await instance({
      method: 'POST',
      url: `api/timelines/${moment.timelineId}/moments`,
      data: moment
    });

    return response.data;
  }
)

export const updateMoment = createAsyncThunk(
  'timeline/updateMoment',
  async (moment: Moment) => {
    const response = await instance({
      method: 'PUT',
      url: `api/timelines/${moment.timelineId}/moments/${moment.id}`,
      data: moment
    });

    return response.data;
  }
)

export const deleteMoment = createAsyncThunk(
  'timeline/deleteMoment',
  async (moment: Moment) => {
    instance({
      method: 'DELETE',
      url: `api/timelines/${moment.timelineId}/moments/${moment.id}`
    });

    return moment.id;
  }
)

export interface TimelineInitialState {
  details: any,
  groupedMoments: any[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}

export const timelineSlice = createSlice<TimelineInitialState, SliceCaseReducers<TimelineInitialState>>({
  name: 'timeline',
  initialState: { details: {}, groupedMoments: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTimelineDetail.pending, (state) => { state.status = 'loading' });
    builder.addCase(getTimelineDetail.fulfilled, (state, action) => {
      state.details = action.payload;
      state.groupedMoments = groupMoments(action.payload.moments);
      state.status = 'idle';
    });
    builder.addCase(createMoment.fulfilled, (state, action) => {
      state.details = {...state.details, moments: [...state.details.moments, action.payload]};
      state.groupedMoments = groupMoments(state.details.moments);
    });
    builder.addCase(updateMoment.fulfilled, (state, action) => {
      let newList = [...state.details.moments];
      const foundIndex = state.details.moments.findIndex(x => x.id === action.payload.id);
      newList[foundIndex] = action.payload;
      state.details = {...state.details, moments: newList};
      state.groupedMoments = groupMoments(state.details.moments);
    });
    builder.addCase(deleteMoment.fulfilled, (state, action) => {
      const foundIndex = state.details.moments.findIndex(x => x.id === action.payload);
      let newList = [...state.details.moments];
      newList.splice(foundIndex, 1);
      state.details = {...state.details, moments: newList};
      state.groupedMoments = groupMoments(state.details.moments);
    })
  }
})

export const selectTimeline = state => state.timeline.details;
export const selectGroupedMoments = state => state.timeline.groupedMoments;
export const selectTimelineIsLoading = state => state.timeline.status === 'loading';
export default timelineSlice.reducer;