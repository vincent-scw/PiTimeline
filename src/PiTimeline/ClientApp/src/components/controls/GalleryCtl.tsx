import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-component';
import Lightbox from '@edentidus/react-media-lightbox';
import '@edentidus/react-media-lightbox/style.css';
import { DirectoryInfo, fetchDir, Media, MediaType, selectDirectoryInfo } from "../../services";
import { GalleryItem } from './GalleryItem';
import { GalleryDirItem } from "./GalleryDirItem";
import { buildImgUrl, ThumbnailSize } from "../../utilities/ImgUrlBuilder";

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
    gutter: 5,
    horizontalOrder: true,
    //transitionDuration: 0
  };

  useEffect(() => {
    if (directorySrc !== undefined) {
      dispatch(fetchDir(directorySrc));
    }
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

  const buildMainContent = (media: Media) => {
    console.log(media)
    return buildImgUrl(media.path, ThumbnailSize.xlarge)
  }

  const buildCustomContent = (media: Media, pos: string) => {
    if (media.metadata.type === MediaType.Photo) {
      return null;
    }

    let videoClass = `ril-image-${pos.toLowerCase()} ril__image gallery-video`;
    if (pos !== 'Current') {
      videoClass += ` ril__image${pos}`;
    }
    return (
      <video src={buildImgUrl(media.path)} style={{width: media.metadata.size?.width, height: media.metadata.size?.height}}
        controls={true} className={`ril-image-${pos} ril__image gallery-video`}></video>
    );
  }

  return (
    <div className="gallery-ctl">
      <div className="gallery-container dir-container">
        {directoryInfo.subDirectories &&
          directoryInfo.subDirectories.map(ele => (
            <GalleryDirItem ele={ele} directoryClicked={() => directoryClicked(ele)} key={ele.name} />
          ))}
      </div>
      <hr className="hr-text" data-content={`${directoryInfo.media?.length ?? 0} items`} />
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
          mainSrc={buildMainContent(directoryInfo.media[itemIndex])}
          nextSrc={buildMainContent(directoryInfo.media[(itemIndex + 1) % directoryInfo.media.length])}
          prevSrc={buildMainContent(directoryInfo.media[(itemIndex + directoryInfo.media.length - 1) % directoryInfo.media.length])}
          onCloseRequest={() => setIsLightxoxOpen(false)}
          onMovePrevRequest={() => setItemIndex((itemIndex + directoryInfo.media.length - 1) % directoryInfo.media.length)}
          onMoveNextRequest={() => setItemIndex((itemIndex + 1) % directoryInfo.media.length)}
          mainCustomContent={buildCustomContent(directoryInfo.media[itemIndex], 'Current')}
          prevCustomContent={buildCustomContent(directoryInfo.media[(itemIndex + directoryInfo.media.length - 1) % directoryInfo.media.length], 'Prev')}
          nextCustomContent={buildCustomContent(directoryInfo.media[(itemIndex + 1) % directoryInfo.media.length], 'Next')}
        />
      }
    </div>
  );
}
