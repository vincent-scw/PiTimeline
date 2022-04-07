import React from "react";
import { Link } from "react-router-dom";
import { Popup } from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { TimelineEditor } from '../timeline/TimelineEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import * as Svc from '../../services';

export interface TimelineCardProps {
  data: Svc.Timeline;
  updateTimeline?: Function;
  deleteTimeline: Function;
}

export const TimelineCard: React.FC<TimelineCardProps> = (props) => {
  const { data, updateTimeline, deleteTimeline } = props;

  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src="https://bulma.io/images/placeholders/1280x960.png" alt="" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <div className="title is-4">
            <Link to={`/t/${data.id}`}>{data.title}</Link>
          </div>
          <div className="level">
            <div className="level-left">
              <div className="level-items tags has-addons">
                <span className="tag">Since</span>
                <span className="tag is-info"><time>1 Jan 2016</time></span>
              </div>
            </div>
            <div className="level-right">
              <Popup position="top center" closeOnDocumentClick={false}
                trigger={<a>
                  <span className="icon has-text-info">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                </a>
                }>
                {close => <TimelineEditor
                  timeline={data}
                  saved={(t) => { close(); updateTimeline(t); }} />}
              </Popup>

              <a onClick={() => deleteTimeline(data)}>
                <span className="icon has-text-grey-light">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}