import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-component';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { DirectoryInfo, fetchDir, Media, selectDirectoryInfo } from "../../services";
import { GalleryItem } from './GalleryItem';
import { GalleryDirItem } from "./GalleryDirItem";
import { buildImgUrl } from "./ImgUrlBuilder";

export interface GalleryCtlProps {
  directorySrc?: string;
  itemSelected?: (item: any) => void;
  directorySelected?: (directory: string) => void;
  selectable?: boolean;
}

export const GalleryCtl: React.FC<GalleryCtlProps> = (props) => {
  const { directorySrc, itemSelected, directorySelected, selectable } = props;
  const dispatch = useDispatch();
  const directoryInfo = useSelector(selectDirectoryInfo);
  const [isLightxoxOpen, setIsLightxoxOpen] = useState<boolean>(false);
  const [itemIndex, setItemIndex] = useState<number>(0);

  const masonryOptions = {
    // columnWidth: '.grid-sizer',
    // itemSelector: '.grid-item',
    gutter: 5,
    horizontalOrder: true,
    fitWidth: true
    //transitionDuration: 0
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

  return (
    <div className="gallery-ctl">
      <div className="gallery-container dir-container">
        {directoryInfo.subDirectories &&
          directoryInfo.subDirectories.map(ele => (
            <GalleryDirItem ele={ele} directoryClicked={() => directoryClicked(ele)} key={ele.name} />
          ))}
      </div>
      <hr />
      <div className="gallery-container">
        <Masonry
          elementType={'ul'}
          options={masonryOptions}>
          {directoryInfo.media &&
            directoryInfo.media.map((ele: Media, index) => (
              <GalleryItem key={ele.name} ele={ele} itemClicked={() => itemClicked(index)} selectable={selectable} itemSelected={itemSelected} />
            ))
          }
        </Masonry>
      </div>
      {isLightxoxOpen &&
        <Lightbox
          mainSrc={buildImgUrl(directoryInfo.media[itemIndex].path)}
          mainSrcThumbnail={buildImgUrl(directoryInfo.media[itemIndex].path, 240)}
          nextSrc={buildImgUrl(directoryInfo.media[(itemIndex + 1) % directoryInfo.media.length].path)}
          nextSrcThumbnail={buildImgUrl(directoryInfo.media[(itemIndex + 1) % directoryInfo.media.length].path, 240)}
          prevSrc={buildImgUrl(directoryInfo.media[(itemIndex + directoryInfo.media.length - 1) % directoryInfo.media.length].path)}
          prevSrcThumbnail={buildImgUrl(directoryInfo.media[(itemIndex + directoryInfo.media.length - 1) % directoryInfo.media.length].path, 240)}
          onCloseRequest={() => setIsLightxoxOpen(false)}
          onMovePrevRequest={() => setItemIndex((itemIndex + directoryInfo.media.length - 1) % directoryInfo.media.length)}
          onMoveNextRequest={() => setItemIndex((itemIndex + 1) % directoryInfo.media.length)}
        />
      }
    </div>
  );
}
