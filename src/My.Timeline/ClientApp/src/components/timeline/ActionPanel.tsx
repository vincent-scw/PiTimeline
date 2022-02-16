import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Popup } from "reactjs-popup";
import { MomentEditor } from './MomentEditor';
import { Moment, Timeline } from "../../services";

export interface ActionPanelProps {
  saved?: Function;
  timeline: Timeline;
}

export const ActionPanel: React.FC<ActionPanelProps> = (props) => {
  const { saved, timeline } = props;
  const newMoment: Moment = { timelineId: timeline.id, content: '' };

  return (
    <div className="panel left-dockbg">
      <p className="panel-block dock-img-block">
        <Popup position="center center" modal={true}
          trigger={<a>
            <span className="icon has-text-success">
              <FontAwesomeIcon icon={faPlus} />
            </span>
          </a>}>
          {close => <MomentEditor saved={(t) => { close(); saved(t); }} moment={newMoment} />
          }
        </Popup>
      </p>
    </div>
  );
}