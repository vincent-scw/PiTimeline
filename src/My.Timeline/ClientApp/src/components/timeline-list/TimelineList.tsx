import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import * as Svc from '../../services';
import { ActionPanel } from "./ActionPanel";

export const TimelineList: React.FC = () => {
  const columnsInLine = 4;

  const [timelines, setTimelines] = useState<Svc.TimelineSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    Svc.TimelineSvc.fetchTimelines()
      .then(res => {
        setTimelines(res.data);
        setIsLoading(false);
      });
  }, []);

  const buildCard = () => {
    const data = timelines;

    var result = [];
    for (var i = 0; i < data.length; i += columnsInLine) {
      result.push(data.slice(i, i + columnsInLine));
    }

    return (
      result.map((r, i) =>
        <div className="columns" key={`c${i}`}>
          {r.map(summary =>
            <div className="column is-3" key={summary.title}>
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content">
                    <div className="title is-4">
                      <Link to={`t/${summary.id}`}>{summary.title}</Link>
                    </div>
                    <div className="subtitle">{summary.description}</div>
                    <time>11:09 PM - 1 Jan 2016</time>
                  </div>
                </div>
              </div>
            </div>)}
        </div>)
    );
  }

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {timelines && buildCard()}
      <ActionPanel />
    </div>
  );
}
