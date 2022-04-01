import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { Container } from 'reactstrap';
import Home from './components/Home';
import { TimelineList } from './components/timeline-list/TimelineList';
import { Timeline } from './components/timeline/Timeline';
import { Gallery } from './components/gallery/Gallery';
import { NoContent } from './components/NoContent';
import NavMenu from './components/nav/NavMenu';
import store from './store';
import { setProgress } from './services';

import './styles/main.scss'

export default () => {
  const { loading } = store.getState();
  
  return (
    <div>
      <LoadingBar
        progress={loading.progress}
        onLoaderFinished={() => store.dispatch(setProgress(0))} />
      <NavMenu />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/t' element={<TimelineList />} />
          <Route path='/t/:tid' element={<Timeline />} />
          <Route path='/g' element={<Gallery />} />
          <Route path='/g/*' element={<Gallery />} />
          <Route path='*' element={<NoContent />} />
        </Routes>
      </Container>
    </div>
  );
};
