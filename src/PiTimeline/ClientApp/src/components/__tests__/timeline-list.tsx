import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import TimelineList from '../timeline-list/TimelineList';
import { createMockTimeline } from '../../utilities/_testUtils';
import { TimelineCard } from '../timeline-list/TimelineCard';

const mockStore = configureMockStore([thunk])

describe('timeline-list', () => {
  const store = mockStore({
    account: { authenticated: true },
    timelineList: { timelines: [createMockTimeline()], status: 'idle' }
  })

  it('renders correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter><TimelineList /></MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(TimelineCard).length).toEqual(1);
  })
})