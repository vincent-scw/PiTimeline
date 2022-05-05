import React, { useState } from 'react';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Media } from "../../services";
import { buildImgUrl } from '../../utilities/ImgUrlBuilder';

const resolutionFactor = 240;

export interface GalleryItemProps {
  ele: Media;
  itemClicked: Function;
  selectable?: boolean;
  itemSelected?: Function;
}

export const GalleryItem: React.FC<GalleryItemProps> = (props) => {
  const { ele, itemClicked, selectable, itemSelected } = props;
  const [hover, setHover] = useState<boolean>(false);

  const buildStyle = (): React.CSSProperties => {
    let width = ele.metadata?.size?.width;
    let height = ele.metadata?.size?.height;

    let factor = height > resolutionFactor ? resolutionFactor / height : 1;
    
    return {
      width: width === null ? null : factor * width,
      height: height === null ? null : factor * height,
    }
  }

  return (
    <li style={buildStyle()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {selectable && hover &&
        <a onClick={() => itemSelected(ele)} style={{ opacity: hover ? 1 : 0, position: 'absolute', height: '36px', width: '100%' }}>
          <span className="icon is-large has-text-success fa-lg">
            <FontAwesomeIcon icon={faCheckCircle} />
          </span>
        </a>
      }

      <a onClick={() => itemClicked()}>
        <LazyLoadImage src={buildImgUrl(ele.path, 240)} style={buildStyle()} />
      </a>
    </li>
  );
}