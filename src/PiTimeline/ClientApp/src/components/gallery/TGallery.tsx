import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Gallery from 'react-grid-gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { ActionPanel } from "./ActionPanel";
import * as Svc from '../../services';

export const TGallery: React.FC = () => {
  const [directories, setDirectories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [pathSegments, setPathSegments] = useState([]);

  const path = useParams<any>();

  useEffect(() => {
    if (path[0])
      setPathSegments(path[0].split('/'));

    Svc.GallerySvc.get(path[0])
      .then(res => {
        const data = res.data;

        setDirectories(data.directories);
        setPhotos(data.photos);
      })
  }, [path])

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
              <li>
                <Link to={`/g/${ps}`} key={ps}>{ps}</Link>
              </li>
            ))
          }
        </ul>
      </nav>

      <div className="section">
        {directories && directories.map((d) => (
          <Link to={`/g/${d.src}`} key={d.src}>{d.caption}</Link>
        ))
        }
      </div>

      <Gallery images={photos} />
      <ActionPanel />
    </React.Fragment>
  );
}