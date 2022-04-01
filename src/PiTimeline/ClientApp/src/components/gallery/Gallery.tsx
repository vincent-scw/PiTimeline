import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { ActionPanel } from "./ActionPanel";
import { GalleryCtl } from "../controls";

export const Gallery: React.FC = () => {
  const navigate = useNavigate();

  const [directory, setDirectory] = useState<string>();
  const [pathSegments, setPathSegments] = useState([]);

  const path = useParams<any>();

  useEffect(() => {
    setPathSegments(path["*"]?.split('/'));
    setDirectory(path["*"] ?? '');
  }, [path])

  const directorySelected = (directory: string) => {
    navigate(`/g/${directory}`);
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
          {pathSegments &&
            pathSegments.map(ps => (
              <li key={ps}>
                <Link to={`/g/${ps}`}>{ps}</Link>
              </li>
            ))
          }
        </ul>
      </nav>

      <GalleryCtl directorySelected={directorySelected} directorySrc={directory} />

      <ActionPanel />
    </React.Fragment>
  );
}