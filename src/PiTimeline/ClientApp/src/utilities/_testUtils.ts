import React from 'react'
import { Provider } from 'react-redux'
import { Timeline, Moment } from '../services';

export const createMockTimeline = (): Timeline => {
  return {
    id: 'id',
    title: 'timeline',
    description: 'desc',
    coverPatternUrl: 'http://mock',
    since: new Date('2022-06-01T00:00:00.000Z') // 01 Jun 2022
  };
};

export const createMockMoment = (): Moment => {
  return {
    id: 'mid',
    content: 'content',
    takePlaceAtDateTime: new Date('2022-06-01T00:00:00.000Z'), // 01 Jun 2022,
    timelineId: 'id'
  };
}