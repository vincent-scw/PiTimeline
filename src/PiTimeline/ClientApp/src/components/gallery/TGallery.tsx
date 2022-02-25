import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Gallery from 'react-grid-gallery';
import { ActionPanel } from "./ActionPanel";
import * as Svc from '../../services';

export const TGallery: React.FC = () => {
  const [directories, setDirectories] = useState([]);
  const [photos, setPhotos] = useState([]);

  const path = useParams<any>();
  
  useEffect(() => {
    Svc.GallerySvc.get(path[0])
      .then(res => {
        const data = res.data;
        console.log(data.directories)
        setDirectories(data.directories);
        setPhotos(data.photos);
      })
  }, [path])

  return (
    <React.Fragment>
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