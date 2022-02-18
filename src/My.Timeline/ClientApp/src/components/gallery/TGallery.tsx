import React, { useEffect, useState } from "react";
import Gallery from 'react-grid-gallery';
import { ActionPanel } from "./ActionPanel";
import * as Svc from '../../services';

export const TGallery: React.FC = () => {
  const [directories, setDirectories] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    Svc.GallerySvc.get()
      .then(res => {
        const data = res.data;
        setDirectories(data.directories);
        setPhotos(data.photos);
      })
  }, [])

  return (
    <React.Fragment>
      <Gallery images={photos} />
      <ActionPanel />
    </React.Fragment>
  );
}