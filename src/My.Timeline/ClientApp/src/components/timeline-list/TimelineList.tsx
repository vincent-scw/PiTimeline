import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../store';
import * as TimelinesStore from '../../store/Timelines';

// At runtime, Redux will merge together...
type TimelineListProps =
  TimelinesStore.TimelinesState // ... state we've requested from the Redux store
  & typeof TimelinesStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

const TimelineList: React.FC<TimelineListProps> = (props) => {
  useEffect(() => {
    props.requestTimelines(1)
  }, []);

  return (
    <div className="columns">
      {props.timelines.map(tl =>
        <div className="column is-4">
          <article key={tl.title} className="notification is-info">
            <p className="title">{tl.title}</p>
            <p className="subtitle">With an image</p>
            <figure className="image is-4by3">
              <img src="https://bulma.io/images/placeholders/640x480.png" />
            </figure>
          </article>
        </div>
      )}
    </div>
  );
}

export default connect(
  (state: ApplicationState) => state.timelines, // Selects which state properties are merged into the component's props
  TimelinesStore.actionCreators // Selects which action creators are merged into the component's props
)(TimelineList as any); // eslint-disable-line @typescript-eslint/no-explicit-any
