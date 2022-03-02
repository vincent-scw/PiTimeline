import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Gallery from 'react-grid-gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { ActionPanel } from "./ActionPanel";
import * as Svc from '../../services';

export const TGallery: React.FC = () => {
  const history = useHistory();

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

  const directoryClicked = (index: number) => {
    history.push(`/g/${directories[index].src}`);
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

      <div className="gallery-container">
        <Gallery images={directories} enableLightbox={false}
          onClickThumbnail={directoryClicked} isSelectable={false} 
          rowHeight={120} />
      </div>
      <hr />
      <div className="gallery-container">
        <Gallery images={photos} />
      </div>
      <ActionPanel />
    </React.Fragment>
  );
}