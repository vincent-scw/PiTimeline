import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../store';
import * as TimelinesStore from '../../store/Timelines';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// At runtime, Redux will merge together...
type TimelineListProps =
  TimelinesStore.TimelinesState // ... state we've requested from the Redux store
  & typeof TimelinesStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

const TimelineList: React.FC<TimelineListProps> = (props) => {
  const columnsInLine = 4;

  useEffect(() => {
    props.requestTimelines()
  }, []);

  const buildCard = () => {
    const data = props.timelines;

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
                        <a><FontAwesomeIcon icon={faTrashAlt} className="has-text-grey-light" /></a>
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
    <React.Fragment>
      {props.isLoading && <span>Loading...</span>}
      {props.timelines && buildCard()}
    </React.Fragment>
  );
}

export default connect(
  (state: ApplicationState) => state.timelines, // Selects which state properties are merged into the component's props
  TimelinesStore.actionCreators // Selects which action creators are merged into the component's props
)(TimelineList as any); // eslint-disable-line @typescript-eslint/no-explicit-any
