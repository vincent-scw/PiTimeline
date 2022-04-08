import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Gallery from 'react-grid-gallery';
import { fetchDir, selectDirectoryInfo } from "../../services";

export interface GalleryCtlProps {
  directorySrc?: string;
  itemSelected?: (item: any) => void;
  directorySelected?: (directory: string) => void;
}

export const GalleryCtl: React.FC<GalleryCtlProps> = (props) => {
  const { directorySrc, itemSelected, directorySelected } = props;
  const dispatch = useDispatch();
  const directoryInfo = useSelector(selectDirectoryInfo);

  useEffect(() => {
    dispatch(fetchDir(directorySrc));
  }, [directorySrc, dispatch])

  const directoryClicked = (index: number) => {
    const directory = directoryInfo?.subDirectories[index];
    if (directorySelected)
      directorySelected(directory.path);

    dispatch(fetchDir(directory.path));
  }

  const cloneItems = (items: any[]) => {
    // Gallery will mutate the object, so need to cloned a new one
    const clonedObj = JSON.parse(JSON.stringify(items));
    return clonedObj;
  }

  return (
    <div className="gallery-ctl">
      <div className="gallery-container">
        <Gallery images={cloneItems(directoryInfo.subDirectories)} enableLightbox={false}
          onClickThumbnail={directoryClicked} isSelectable={false}
          rowHeight={120} />
      </div>
      <hr />
      <div className="gallery-container">
        <Gallery images={cloneItems(directoryInfo.items)} onSelectImage={(i) => itemSelected(directoryInfo.items[i])} />
      </div>
    </div>
  );
}
