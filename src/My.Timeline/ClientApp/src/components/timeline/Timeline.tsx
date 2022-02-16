import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ActionPanel } from './ActionPanel';
import * as Svc from '../../services';
import { 
  GroupedMoments, 
  MomentsGroupingHandler as MGHandler 
} from './MomentsGroupingHandler';

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
                    <p className="heading">{m.takePlaceAtDateTime.toDateString()}</p>
                    <p>{m.content}</p>
                    <div className="level is-mobile">
                      <div className="level-left"></div>
                      <div className="level-right">
                        <button className="level-item button is-ghost">

                        </button>
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
          <ActionPanel saved={refresh} timeline={timeline}/>
        </div>
      }
    </div>
  );
}