import React, { useState } from 'react';
import { faCheckCircle, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Media, MediaType } from "../../services";
import { buildImgUrl, ThumbnailSize } from '../../utilities/ImgUrlBuilder';

const resolutionFactor = ThumbnailSize.small;

export interface GalleryItemProps {
  ele: Media;
  itemClicked: Function;
  selectable?: boolean;
  itemSelected?: Function;
}

export const GalleryItem: React.FC<GalleryItemProps> = (props) => {
  const { ele, itemClicked, selectable, itemSelected } = props;
  const [hover, setHover] = useState<boolean>(false);
  const [showPlaceHolder, setShowPlaceHolder] = useState<boolean>(true);

  const buildStyle = (): React.CSSProperties => {
    let width = ele.metadata?.size?.width;
    let height = ele.metadata?.size?.height;

    let factor = width > resolutionFactor ? resolutionFactor / width : 1;

    return {
      width: resolutionFactor,
      height: factor * height,
    }
  }

  return (
    <li style={buildStyle()} className="gallery-item"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {selectable && hover &&
        <a onClick={() => itemSelected(ele)} style={{ opacity: hover ? 1 : 0, position: 'absolute', height: '36px', width: '100%' }}>
          <span className="icon is-large has-text-success fa-lg">
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
        </a>
      }

      <div style={{ opacity: hover ? 1 : 0, 
        position: 'absolute', bottom: 0, 
        height: '36px', width: '100%' }}>
        <span className='tag is-primary is-light gallery-item-caption'>{ele.name}</span>
      </div>

      {ele.metadata.type === MediaType.Video &&
        <span className='icon is-large has-text-info fa-lg gallery-item-video-tag'>
          <FontAwesomeIcon icon={faVideo} />
        </span>
      }

      <a onClick={() => itemClicked()}>
        <LazyLoadImage
          src={buildImgUrl(ele.path, ThumbnailSize.small)}
          alt={ele.name}
          afterLoad={() => setShowPlaceHolder(false)} />
      </a>
      {showPlaceHolder && <img src="../assets/spinner.gif" className="loading-spinner" />}
    </li>
  );
}