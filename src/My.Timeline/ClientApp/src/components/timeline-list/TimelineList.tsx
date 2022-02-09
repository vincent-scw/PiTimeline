import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import * as Svc from '../../services';
import { ActionPanel } from "./ActionPanel";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { TimelineEditor } from '../timeline/TimelineEditor';

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
                        <Popup position="top center"
                          trigger={<a>
                            <span className="icon has-text-info">
                              <FontAwesomeIcon icon={faEdit} />
                            </span>
                          </a>
                          }>
                          {close => <TimelineEditor 
                            timeline={summary}
                            saved={(t) => { close(); timelineUpdated(t); }} />}
                        </Popup>

                        <a onClick={() => deleteTimeline(summary)}>
                          <span className="icon has-text-grey-light">
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </span>
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
      <ActionPanel saved={(t) => setTimelines([t, ...timelines])} />
    </div>
  );
}
