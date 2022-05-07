import React from "react";
import Moment from 'react-moment';
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { MomentEditor } from "./MomentEditor";
import * as Svc from "../../services";

export interface MomentItemProps {
  moment: Svc.Moment;
  deleteMoment?: Function
}

export const MomentItem: React.FC<MomentItemProps> = (props) => {
  const { moment, deleteMoment } = props;

  return (
    <div className="timeline-item">
      <div className="timeline-marker"></div>
      <div className="timeline-content">
        <p className="heading scrollable-header" id={`m-${moment.id}`}>
          <Moment format="ddd MMM DD">{moment.takePlaceAtDateTime}</Moment>
        </p>
        <p dangerouslySetInnerHTML={{ __html: moment.content }} />
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
              {close => <MomentEditor done={close} moment={moment} />}
            </Popup>

            <a onClick={() => deleteMoment(moment)}>
              <span className="icon has-text-grey-light">
                <FontAwesomeIcon icon={faTrashAlt} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}