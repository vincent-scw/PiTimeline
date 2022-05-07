import React from 'react';
import { DirectoryInfo } from '../../services';
import { buildImgUrl, ThumbnailSize } from '../../utilities/ImgUrlBuilder';

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
          <img src={buildImgUrl(ele.path, ThumbnailSize.small)} className="gallery-dir-img" />
          <figcaption>{ele.name}</figcaption>
        </figure>
      </a>
    </div>
  );
}