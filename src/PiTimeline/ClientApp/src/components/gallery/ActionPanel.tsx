import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import { faClock } from '@fortawesome/free-solid-svg-icons';

export const ActionPanel: React.FC = () => {

  return (
    <div className="panel left-dockbg">
      <p className="panel-block dock-img-block">
        <Link to={'/t'}>
          <FontAwesomeIcon icon={faClock} />
        </Link>
      </p>
    </div>
  );
}