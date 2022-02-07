import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import { Timeline } from './components/timeline/Timeline';

import './styles/main.scss'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/t/:tid' component={Timeline} />
    </Layout>
);
