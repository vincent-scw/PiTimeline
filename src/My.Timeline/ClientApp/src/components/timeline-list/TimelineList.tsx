import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import * as Svc from '../../services';
import { ActionPanel } from "./ActionPanel";
import { toast } from "react-toastify";
import { TimelineSummary } from "../../services";

export const TimelineList: React.FC = () => {
  const columnsInLine = 4;

  const [timelines, setTimelines] = useState<Svc.TimelineSummary[]>([]);
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

  const deleteTimeline = (timeline: TimelineSummary) => {
    if (window.confirm('Are you sure you wish to delete this item?'))
      Svc.TimelineSvc.deleteTimeline(timeline.id).then(_ => {
        toast.info(`Timeline ${timeline.title} has been deleted`);
        refresh();
      });
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
                    <div className="level">
                      <div className="level-left">
                        <div className="level-items tags has-addons">
                          <span className="tag">Since</span>
                          <span className="tag is-info"><time>1 Jan 2016</time></span>
                        </div>
                      </div>
                      <div className="level-right">
                        <a onClick={() => deleteTimeline(summary)}>
                          <FontAwesomeIcon icon={faTrashAlt} className="has-text-grey-light" />
                        </a>
                      </div>
                    </div>
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
