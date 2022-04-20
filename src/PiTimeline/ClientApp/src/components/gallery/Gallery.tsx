import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { ActionPanel } from "./ActionPanel";
import { GalleryCtl } from "../controls";
import { useSelector } from "react-redux";
import { selectLatestDir } from "../../services";

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const latestDir = useSelector(selectLatestDir);
  const [directory, setDirectory] = useState<string>();

  const path = useParams<any>();

  useEffect(() => {
    setDirectory(path["*"] ?? '');
  }, [path])

  const directorySelected = (directory: string) => {
    navigate(`/g/${directory}`);
  }

  const buildRoute = () => {
    const segments = latestDir.split('/');
    const segObj = segments.reduce((x, y) => {
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
          {latestDir && buildRoute()}
        </ul>
      </nav>

      <GalleryCtl directorySelected={directorySelected} directorySrc={directory} />

      <ActionPanel />
    </React.Fragment>
  );
}

export default Gallery;