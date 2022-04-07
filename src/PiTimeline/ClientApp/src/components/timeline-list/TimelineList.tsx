import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as Svc from '../../services';
import { ActionPanel } from "./ActionPanel";
import { TimelineCard } from './TimelineCard';
import { fetchTimelines, selectTimelines, deleteTimeline } from "../../services";

const TimelineList: React.FC = () => {
  const columnsInLine = 4;

  const dispatch = useDispatch();
  const timelineList = useSelector(selectTimelines);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchTimelines());
  }, [dispatch]);

  const delTimeline = (timeline: Svc.Timeline) => {
    if (window.confirm('Are you sure you wish to delete this item?'))
      dispatch(deleteTimeline(timeline.id));
  }

  const buildCard = () => {
    const data = timelineList;

    var result = [];
    for (var i = 0; i < data.length; i += columnsInLine) {
      result.push(data.slice(i, i + columnsInLine));
    }

    return (
      result.map((r, i) =>
        <div className="columns" key={`c${i}`}>
          {r.map(entity =>
            <div className="column is-3" key={entity.title}>
              <TimelineCard data={entity} deleteTimeline={delTimeline} />
            </div>)}
        </div>)
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