import React, { useState } from 'react';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Media } from "../../services";
import { buildImgUrl } from './ImgUrlBuilder';

export interface GalleryItemProps {
  ele: Media;
  itemClicked: Function;
  selectable?: boolean;
  itemSelected?: Function;
}

const itemStyle: React.CSSProperties = {

}

export const GalleryItem: React.FC<GalleryItemProps> = (props) => {
  const { ele, itemClicked, selectable, itemSelected } = props;
  const [hover, setHover] = useState<boolean>(false);

  return (
    <li
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
        <img src={buildImgUrl(ele.path, 240)} style={itemStyle} />
      </a>
    </li>
  );
}