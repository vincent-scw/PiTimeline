import React from 'react';
import { mount } from 'enzyme';
import { MomentItem } from '../timeline/MomentItem';
import { createMockMoment } from '../../utilities/_testUtils';

describe('moment-item', () => {
  it('renders correctly', () => {
    const moment = createMockMoment();
    const wrapper = mount(<MomentItem moment={moment}/>);

    expect(wrapper).toMatchSnapshot();
  })
})