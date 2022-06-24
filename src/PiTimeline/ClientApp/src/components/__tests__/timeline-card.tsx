import React from 'react';
import { mount } from 'enzyme';
import { TimelineCard } from "../timeline-list/TimelineCard";
import { MemoryRouter } from 'react-router-dom';
import { createMockTimeline } from '../../utilities/_testUtils';

describe('timeline-card', () => {
  it('renders correctly', () => {
    const timeline = createMockTimeline();
    const delFunc = jest.fn();
    const wrapper = mount(<MemoryRouter><TimelineCard data={timeline} deleteTimeline={delFunc} /></MemoryRouter>);
    expect(wrapper.find(TimelineCard)).toMatchSnapshot();
  })
})
