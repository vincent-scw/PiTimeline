import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const ActionPanel: React.FC = () => {
  const create = () => {

  }

  return (
    <div className="panel left-dockbg">
      <p className="panel-block dock-img-block">
        <a onClick={create}>
          <span className="icon has-text-success">
            <FontAwesomeIcon icon={faPlus} />
          </span>
        </a>
      </p>
    </div>
  );
}