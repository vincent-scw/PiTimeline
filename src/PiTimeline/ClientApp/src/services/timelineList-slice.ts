import { createAsyncThunk, createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Timeline } from ".";
import instance from './axios-instance';

export const fetchTimelines = createAsyncThunk(
  'timeline/fetchTimelines',
  async () => {
    const response = await instance({
      method: 'GET',
      url: '/api/timelines'
    });

    return response.data;
  }
)

export const updateTimeline = createAsyncThunk(
  'timeline/updateTimeline',
  async (timeline: Timeline) => {
    const response = await instance({
      method: 'PUT',
      url: `api/timelines/${timeline.id}`,
      data: timeline
    });

    return response.data;
  }
)

export const deleteTimeline = createAsyncThunk(
  'timeline/deleteTimeline',
  async (timelineId: string) => {
    await instance({
      method: 'DELETE',
      url: `api/timelines/${timelineId}`
    });

    return timelineId;
  }
)

export const createTimeline = createAsyncThunk(
  'timeline/createTimeline',
  async (timeline: Timeline) => {
    const response = await instance({
      method: 'POST',
      url: `api/timelines`,
      data: timeline
    });

    return response.data;
  }
)

export interface TimelineListInitialState {
  timelines: Timeline[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}

export const timelineListSlice = createSlice<TimelineListInitialState, SliceCaseReducers<TimelineListInitialState>>({
  name: 'timelineList',
  initialState: { timelines: [], status: 'idle', error: null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTimelines.pending, (state) => {state.status = 'loading'});
    builder.addCase(fetchTimelines.fulfilled, (state, action) => {
      state.timelines = action.payload;
      state.status = 'idle';
    });
    builder.addCase(createTimeline.fulfilled, (state, action) => {
      state.timelines = [action.payload, ...state.timelines];
    });
    builder.addCase(updateTimeline.fulfilled, (state, action) => {
      const timeline = action.payload;
      let newList = [...state.timelines];
      const updatedIndex = newList.findIndex(x => x.id === timeline.id);
      newList[updatedIndex] = timeline;
      state.timelines = newList;
    });
    builder.addCase(deleteTimeline.fulfilled, (state, action) => {
      // payload is timeline id
      const foundIndex = state.timelines.findIndex(x => x.id === action.payload);
      let newList = [...state.timelines];
      newList.splice(foundIndex, 1);
      state.timelines = newList;
    });
  }
})

export const selectTimelines = state => state.timelineList.timelines;
export const selectTimelineListIsLoading = state => state.timelineList.status === 'loading';
export const timelineListReducer = timelineListSlice.reducer;