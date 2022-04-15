import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-component';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { DirectoryInfo, fetchDir, selectDirectoryInfo } from "../../services";
import { GalleryItem } from './GalleryItem';
import { GalleryDirItem } from "./GalleryDirItem";

export interface GalleryCtlProps {
  directorySrc?: string;
  itemSelected?: (item: any) => void;
  directorySelected?: (directory: string) => void;
}

export const GalleryCtl: React.FC<GalleryCtlProps> = (props) => {
  const { directorySrc, itemSelected, directorySelected } = props;
  const dispatch = useDispatch();
  const directoryInfo = useSelector(selectDirectoryInfo);
  const [isLightxoxOpen, setIsLightxoxOpen] = useState<boolean>(false);
  const [itemIndex, setItemIndex] = useState<number>(0);

  const masonryOptions = {
    transitionDuration: 0
  };

  useEffect(() => {
    dispatch(fetchDir(directorySrc));
  }, [directorySrc, dispatch])

  const directoryClicked = (dir: DirectoryInfo) => {
    if (directorySelected)
      directorySelected(dir.path);

    dispatch(fetchDir(dir.path));
  }

  const itemClicked = (index: number) => {
    setItemIndex(index);
    setIsLightxoxOpen(true);
  }

  const buildDirectories = (dirs: DirectoryInfo[]) => {
    const chunkSize = 6;
    const maxLength = Math.ceil(dirs.length / chunkSize);
    let newDirs = [...dirs];
    let chunk = Array.from({ length: maxLength }, () => newDirs.splice(0, chunkSize));

    return chunk.map(c => (
      <div className="columns">
        {
          c.map(ele => (
            <GalleryDirItem ele={ele} directoryClicked={() => directoryClicked(ele)} key={ele.src} />
          ))
        }
      </div>
    ));
  }

  return (
    <div className="gallery-ctl">
      <div className="gallery-container">
        {buildDirectories(directoryInfo.subDirectories)}
      </div>
      <hr />
      <div className="gallery-container">
        <Masonry
          elementType={'ul'}
          options={masonryOptions}>
          {
            directoryInfo.items.map((ele, index) => (
              <GalleryItem key={ele.src} ele={ele} itemClicked={() => itemClicked(index)} selectable={true} />
            ))
          }
        </Masonry>
      </div>
      {isLightxoxOpen &&
        <Lightbox
          mainSrc={directoryInfo.items[itemIndex].src}
          mainSrcThumbnail={directoryInfo.items[itemIndex].thumbnail}
          nextSrc={directoryInfo.items[(itemIndex + 1) % directoryInfo.items.length].src}
          nextSrcThumbnail={directoryInfo.items[(itemIndex + 1) % directoryInfo.items.length].thumbnail}
          prevSrc={directoryInfo.items[(itemIndex + directoryInfo.items.length - 1) % directoryInfo.items.length].src}
          prevSrcThumbnail={directoryInfo.items[(itemIndex + directoryInfo.items.length - 1) % directoryInfo.items.length].thumbnail}
          onCloseRequest={() => setIsLightxoxOpen(false)}
          onMovePrevRequest={() => setItemIndex((itemIndex + directoryInfo.items.length - 1) % directoryInfo.items.length)}
          onMoveNextRequest={() => setItemIndex((itemIndex + 1) % directoryInfo.items.length)}
        />
      }
    </div>
  );
}
