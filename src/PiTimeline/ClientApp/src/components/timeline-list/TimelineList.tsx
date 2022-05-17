import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-component';
import * as Svc from '../../services';
import { ActionPanel } from "./ActionPanel";
import { TimelineCard } from './TimelineCard';
import {
  fetchTimelines,
  selectTimelines,
  deleteTimeline,
  selectTimelineListIsLoading,
  selectAuthenticated
} from "../../services";

const TimelineList: React.FC = () => {
  const masonryOptions = {
    gutter: 10,
    horizontalOrder: true,
    //transitionDuration: 0
  };

  const dispatch = useDispatch();
  const authenticated = useSelector(selectAuthenticated);
  const timelineList = useSelector(selectTimelines);
  const isLoading = useSelector(selectTimelineListIsLoading);

  useEffect(() => {
    dispatch(fetchTimelines());
  }, [dispatch, authenticated]);

  const delTimeline = (timeline: Svc.Timeline) => {
    if (window.confirm('Are you sure you wish to delete this item?'))
      dispatch(deleteTimeline(timeline.id));
  }

  const buildCard = () => {
    return (
      <Masonry options={masonryOptions}>
        {timelineList.map((t, i) =>
          <TimelineCard data={t} key={`t-${i}`} deleteTimeline={delTimeline} />
        )}
      </Masonry>
    );
  }

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {timelineList && buildCard()}
      <ActionPanel />
    </div>
  );
}

export default TimelineList;