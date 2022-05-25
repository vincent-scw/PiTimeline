import React from 'react';
import { mount } from 'enzyme';
import { TimelineCard } from "../timeline-list/TimelineCard";
import { MemoryRouter } from 'react-router-dom';
import { Timeline } from '../../services';

it('renders correctly', () => {
  const timeline: Timeline = {
    id: 'id',
    title: 'timeline',
    description: 'desc',
    coverPatternUrl: 'http://mock',
    since: new Date(2022, 5, 1) // 01 Jun 2022, month is zero-based
  };
  const delFunc = jest.fn();
  const wrapper = mount(<MemoryRouter><TimelineCard data={timeline} deleteTimeline={delFunc} /></MemoryRouter>);
  expect(wrapper.find(TimelineCard)).toMatchSnapshot();
})