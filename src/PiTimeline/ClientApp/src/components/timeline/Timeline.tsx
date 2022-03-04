import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Moment from 'react-moment';
import { ActionPanel } from './ActionPanel';
import * as Svc from '../../services';
import {
  GroupedMoments,
  MomentsGroupingHandler as MGHandler
} from './MomentsGroupingHandler';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import { MomentEditor } from "./MomentEditor";

export const Timeline: React.FC = () => {
  const { tid } = useParams<any>();
  const [timeline, setTimeline] = useState<Svc.Timeline>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groupedMoments, setGroupedMoments] = useState<GroupedMoments[]>([]);

  useEffect(() => {
    refresh();
  }, [tid])

  const refresh = () => {
    setIsLoading(true);
    Svc.TimelineSvc.getTimeline(tid)
      .then(res => {
        if (res.data.moments) {
          const grouped = MGHandler.groupMoments(res.data.moments);
          setGroupedMoments(grouped);
        }

        setTimeline(res.data);
        setIsLoading(false);
      });
  }

  const deleteMoment = (moment: Svc.Moment) => {

  }

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {timeline &&
        <div>
          <div className="t-content">
            <section>
              <h1 className="title">
                {timeline.title}
              </h1>
            </section>
          </div>
          {groupedMoments.map(gm => (
            <div className="timeline" key={gm.group}>
              <header className="timeline-header">
                <span className="tag is-primary">{gm.group}</span>
              </header>
              {gm.moments.map(m => (
                <div className="timeline-item" key={m.id}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <p className="heading">
                      <Moment format="ddd MMM DD">{m.takePlaceAtDateTime}</Moment>
                    </p>
                    <p dangerouslySetInnerHTML={{ __html: m.content }} />
                    <div className="level is-mobile">
                      <div className="level-left"></div>
                      <div className="level-right">
                        <Popup position="center center" modal={true} closeOnDocumentClick={false}
                          trigger={
                            <a className="level-item" >
                              <span className="icon has-text-info">
                                <FontAwesomeIcon icon={faEdit} />
                              </span>
                            </a>
                          }>
                          {close => <MomentEditor saved={(t) => { close(); refresh(); }} moment={m} />}
                        </Popup>

                        <a onClick={() => deleteMoment(m)}>
                          <span className="icon has-text-grey-light">
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
          }
          <div className="timeline">
            <div className="timeline-header">
              <span className="tag is-medium is-primary"><img src="../assets/favicon.png"></img></span>
            </div>
          </div>
          <ActionPanel saved={refresh} timeline={timeline} />
        </div>
      }
    </div>
  );
}