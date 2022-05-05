import React from 'react';
import { DirectoryInfo } from '../../services';
import { buildImgUrl } from '../../utilities/ImgUrlBuilder';

const dirItemStyle: React.CSSProperties = {
  height: '150px'
}

export interface GalleryDirItemProps {
  ele: DirectoryInfo;
  directoryClicked: Function;
}

export const GalleryDirItem: React.FC<GalleryDirItemProps> = (props) => {
  const { ele, directoryClicked } = props;

  return (
    <div key={ele.name} className="gallery-dir-item">
      <a onClick={() => directoryClicked()}>
        <figure>
          <img src={buildImgUrl(ele.path, 240)} style={dirItemStyle} className="gallery-dir-img" />
          <figcaption>{ele.name}</figcaption>
        </figure>
      </a>
    </div>
  );
}