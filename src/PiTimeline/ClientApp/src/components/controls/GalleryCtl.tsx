import React, { useEffect, useState } from "react";
import Gallery from 'react-grid-gallery';
import * as Svc from '../../services';

export interface GalleryCtlProps {
  directorySrc?: string;
  itemSelected?: (item: any) => void;
  directorySelected?: (directory: string) => void;
}

const defaultDirectoryInfo: Svc.DirectoryInfo = { src: '', subDirectories: [], items: [] };

export const GalleryCtl: React.FC<GalleryCtlProps> = (props) => {
  const { directorySrc, itemSelected, directorySelected } = props;
  const [directoryInfo, setDirectoryInfo] = useState<Svc.DirectoryInfo>(defaultDirectoryInfo);

  useEffect(() => {
    refreshDirectory(directorySrc ?? defaultDirectoryInfo.src);
  }, [directorySrc])

  const refreshDirectory = (directory: string) => {
    console.log('dir', directory)
    Svc.GallerySvc.get(directory)
      .then(res => {
        const data = res.data;
        setDirectoryInfo(data);
      })
  }

  const directoryClicked = (index: number) => {
    const directory = directoryInfo?.subDirectories[index];
    if (directorySelected)
      directorySelected(directory.src);

    refreshDirectory(directory.src);
  }

  return (
    <React.Fragment>
      <div className="gallery-container">
        <Gallery images={directoryInfo.subDirectories} enableLightbox={false}
          onClickThumbnail={directoryClicked} isSelectable={false}
          rowHeight={120} />
      </div>
      <hr />
      <div className="gallery-container">
        <Gallery images={directoryInfo.items} onSelectImage={(i) => itemSelected(directoryInfo.items[i])} />
      </div>
    </React.Fragment>
  );
}
