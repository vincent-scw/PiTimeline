import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faPlus } from '@fortawesome/free-solid-svg-icons';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { TimelineEditor } from '../timeline/TimelineEditor';
import { Link } from "react-router-dom";

export interface ActionPanelProps {
  saved?: Function;
}

export const ActionPanel: React.FC<ActionPanelProps> = (props) => {
  const { saved } = props;

  return (
    <div className="panel left-dockbg">
      <p className="panel-block dock-img-block">
        <Popup position="right center"
          trigger={<a>
            <span className="icon has-text-success">
              <FontAwesomeIcon icon={faPlus} />
            </span>
          </a>}>
          {close => <TimelineEditor saved={(t) => { close(); saved(t); }} />
          }
        </Popup>
      </p>
      <p className="panel-block dock-img-block">
        <Link to={'/g'}>
          <FontAwesomeIcon icon={faImages} />
        </Link>
      </p>
    </div>
  );
}