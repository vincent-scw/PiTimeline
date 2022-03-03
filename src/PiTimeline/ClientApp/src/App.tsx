import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import { TimelineList } from './components/timeline-list/TimelineList';
import { Timeline } from './components/timeline/Timeline';
import { Gallery } from './components/gallery/Gallery';
import { NoContent } from './components/NoContent';

import './styles/main.scss'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/t' component={TimelineList} />
        <Route path='/t/:tid' component={Timeline} />
        <Route exact path='/g' component={Gallery} />
        <Route path='/g/*' component={Gallery} />
        {/* <Route exact path='*' component={NoContent} /> */}
    </Layout>
);
