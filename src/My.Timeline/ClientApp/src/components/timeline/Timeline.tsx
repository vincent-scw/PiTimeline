import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as TimelineStore from '../../store/Timeline';

type TimelineProps =
  TimelineStore.TimelineDetailState
  & typeof TimelineStore.actionCreators
  & RouteComponentProps<{ tid: string }>;

const Timeline: React.FC<TimelineProps> = (props) => {
  const { isLoading, timeline } = props;

  useEffect(() => {
    props.getTimeline(props.match.params.tid);
  }, [props.match.params.tid])

  return (
    <React.Fragment>
      {isLoading && <div>Loading...</div>}
      {timeline &&
        <div className="t-content">
          <section className="section">
            <h1 className="title">
              {timeline.title}
            </h1>
          </section>
        </div>
      }
    </React.Fragment>
  );
}

export default connect(
  (state: ApplicationState) => state.currentTimeline,
  TimelineStore.actionCreators
)(Timeline as any)