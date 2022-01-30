import * as React from 'react';
import { connect } from 'react-redux';
import TimelineList from './timeline-list/TimelineList';

const Home = () => (
  <div>
    <TimelineList />
  </div>
);

export default connect()(Home);
