import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Popup from "reactjs-popup";
import { TimelineEditor } from '../timeline/TimelineEditor';

export const ActionPanel: React.FC = () => {
  const create = () => {

  }

  return (
    <div className="panel left-dockbg">
      <p className="panel-block dock-img-block">
        <Popup position="center center"
          trigger={<a onClick={create} className="has-text-success">
            <FontAwesomeIcon icon={faPlus} />
          </a>}>
          <TimelineEditor />
        </Popup>

      </p>
    </div>
  );
}