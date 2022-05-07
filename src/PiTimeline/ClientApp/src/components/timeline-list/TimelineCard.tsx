import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Popup } from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import moment from "moment";
import { TimelineEditor } from '../timeline/TimelineEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import * as Svc from '../../services';

export interface TimelineCardProps {
  data: Svc.Timeline;
  deleteTimeline: Function;
}

export const TimelineCard: React.FC<TimelineCardProps> = (props) => {
  const { data, deleteTimeline } = props;
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div className="card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={data.coverPatternUrl ?? 'assets/favicon.png'} alt="" className="timeline-default-cover" />
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
                <span className="tag is-dark">Since</span>
                <span className="tag is-info"><time>{moment(data.since).format('DD MMM YYYY')}</time></span>
              </div>
            </div>
            <div className="level-right">
              {hover &&
                <>
                  <Popup position="center center" modal={true} closeOnDocumentClick={false}
                    trigger={<a>
                      <span className="icon has-text-info">
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                    </a>
                    }>
                    {close => <TimelineEditor
                      timeline={data}
                      done={close} />}
                  </Popup>

                  <a onClick={() => deleteTimeline(data)}>
                    <span className="icon has-text-grey-light">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </span>
                  </a>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}