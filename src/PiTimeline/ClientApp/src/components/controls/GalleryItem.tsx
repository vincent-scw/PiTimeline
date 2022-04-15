import React, { useState } from 'react';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ItemInfo } from "../../services";

export interface GalleryItemProps {
  ele: ItemInfo;
  itemClicked: Function;
  selectable?: boolean;
  itemSelected?: Function;
}

const itemStyle: React.CSSProperties = {
  maxWidth: '330px',
  padding: '0 3px'
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
        <img src={ele.thumbnail} style={itemStyle} />
      </a>
    </li>
  );
}