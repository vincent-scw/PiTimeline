import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { ActionPanel } from "./ActionPanel";
import { GalleryCtl } from "../controls";
import { useSelector } from "react-redux";
import { selectAuthenticated } from "../../services";

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = useSelector(selectAuthenticated);
  const [directory, setDirectory] = useState<string>();

  const path = useParams<any>();

  useEffect(() => {
    setDirectory(path["*"] ?? '');
  }, [path, authenticated])

  const directorySelected = (directory: string) => {
    navigate(`/g/${directory}`);
  }

  const buildRoute = () => {
    const segments = directory.split('/');
    const segObj = segments.reduce((x: any, y) => {
      const last = x.at(-1);
      if (last) {
        x.push(`${last}/${y}`);
      } else {
        x.push(y);
      }
      return x;
    }, []);

    return segments.map((ps, index) => (
      <li key={ps}>
        <Link to={`/g/${segObj[index]}`}>{ps}</Link>
      </li>
    ));
  }

  return (
    <React.Fragment>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to={`/g`}>
              <span className="icon">
                <FontAwesomeIcon icon={faImages} />
              </span>
              <span>Gallery</span>
            </Link>
          </li>
          {directory && buildRoute()}
        </ul>
      </nav>
      
      {authenticated &&
        <GalleryCtl directorySelected={directorySelected} directorySrc={directory} />}

      <ActionPanel />
    </React.Fragment>
  );
}

export default Gallery;