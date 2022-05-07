import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ActionPanel } from './ActionPanel';
import { useSelector, useDispatch } from "react-redux";
import { MomentItem } from "./MomentItem";
import { TableOfContents } from "./TableOfContents";
import {
  getTimelineDetail,
  deleteMoment,
  selectGroupedMoments,
  selectTimeline,
  selectTimelineIsLoading,
  selectAuthenticated
} from "../../services";

const Timeline: React.FC = () => {
  const { tid } = useParams<any>();

  const dispatch = useDispatch();
  const authenticated = useSelector(selectAuthenticated);
  const timeline = useSelector(selectTimeline);
  const isLoading = useSelector(selectTimelineIsLoading);
  const groupedMoments = useSelector(selectGroupedMoments);

  useEffect(() => {
    dispatch(getTimelineDetail(tid));
  }, [tid, dispatch, authenticated])

  const delMoment = (moment) => {
    dispatch(deleteMoment(moment));
  }

  return (
    <div className="t-details">
      {isLoading && <div>Loading...</div>}
      {timeline &&
        <div className="columns">
          <div className="column">
            <div className="t-content">
              <section>
                <h1 className="title">
                  {timeline.title}
                </h1>
              </section>
            </div>
            {groupedMoments.map(gm => (
              <div className="timeline" key={gm.group}>
                <header className="timeline-header scrollable-header" id={`gm-${gm.id}`}>
                  <span className="tag is-primary">{gm.group}</span>
                </header>
                {gm.moments.map(m => (
                  <MomentItem key={m.id} moment={m} deleteMoment={delMoment} />
                ))}
              </div>
            ))
            }
            <div className="timeline">
              <div className="timeline-header">
                <span className="tag is-medium is-primary"><img src="../assets/favicon.png"></img></span>
              </div>
            </div>
          </div>
          <ActionPanel timeline={timeline} />
          <div className="column is-one-fifth">
            <TableOfContents headers={groupedMoments} />
          </div>
        </div>
      }
    </div>
  );
}

export default Timeline;