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
  const columnsInLine = 3;

  useEffect(() => {
    props.requestTimelines(1)
  }, []);

  const buildCard = () => {
    const data = props.timelines;
    if (!data) return;

    var result = [];
    for (var i = 0; i < data.length; i += columnsInLine) {
      result.push(data.slice(i, i + columnsInLine));
    }

    return (
      result.map((r, i) =>
        <div className="columns" key={`c${i}`}>
          {r.map(c =>
            <div className="column" key={c.title}>
              <div className="is-4 card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content">
                    <div className="title is-4">{c.title}</div>
                    <br />
                    <time>11:09 PM - 1 Jan 2016</time>
                  </div>
                </div>
              </div>
            </div>)}
        </div>)
    );
  }

  return (
    <React.Fragment>
      {buildCard()}
    </React.Fragment>
  );
}

export default connect(
  (state: ApplicationState) => state.timelines, // Selects which state properties are merged into the component's props
  TimelinesStore.actionCreators // Selects which action creators are merged into the component's props
)(TimelineList as any); // eslint-disable-line @typescript-eslint/no-explicit-any
