import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
    const response = await instance({
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

export const timelineListSlice = createSlice({
  name: 'timelineList',
  initialState: { timelines: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTimelines.fulfilled, (state, action) => {
      state.timelines = action.payload;
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
export default timelineListSlice.reducer;