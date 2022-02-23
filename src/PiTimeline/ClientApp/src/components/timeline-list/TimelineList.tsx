import React, { useEffect, useState } from "react";
import * as Svc from '../../services';
import { ActionPanel } from "./ActionPanel";
import { toast } from "react-toastify";
import { TimelineCard } from './TimelineCard';

export const TimelineList: React.FC = () => {
  const columnsInLine = 4;

  const [timelines, setTimelines] = useState<Svc.Timeline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setIsLoading(true);
    Svc.TimelineSvc.fetchTimelines()
      .then(res => {
        setTimelines(res.data);
        setIsLoading(false);
      });
  }

  const deleteTimeline = (timeline: Svc.Timeline) => {
    if (window.confirm('Are you sure you wish to delete this item?'))
      Svc.TimelineSvc.deleteTimeline(timeline.id).then(_ => {
        toast.info(`Timeline ${timeline.title} has been deleted`);
        refresh();
      });
  }

  const timelineUpdated = (timeline: Svc.Timeline) => {
    let newList = [...timelines];
    const updatedIndex = newList.findIndex(x => x.id === timeline.id);
    newList[updatedIndex] = timeline;
    setTimelines(newList);
  }

  const buildCard = () => {
    const data = timelines;

    var result = [];
    for (var i = 0; i < data.length; i += columnsInLine) {
      result.push(data.slice(i, i + columnsInLine));
    }

    return (
      result.map((r, i) =>
        <div className="columns" key={`c${i}`}>
          {r.map(entity =>
            <div className="column is-3" key={entity.title}>
              <TimelineCard data={entity} updateTimeline={timelineUpdated} deleteTimeline={deleteTimeline} />
            </div>)}
        </div>)
    );
  }

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {timelines && buildCard()}
      <ActionPanel saved={(t) => setTimelines([t, ...timelines])} />
    </div>
  );
}
