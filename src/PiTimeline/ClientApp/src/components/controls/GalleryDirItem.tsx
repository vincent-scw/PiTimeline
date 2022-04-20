import React from 'react';
import { DirectoryInfo } from '../../services';

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
    <div key={ele.src} className="column is-2">
      <a onClick={() => directoryClicked()}>
        <figure>
          <img src={ele.thumbnail} style={dirItemStyle} />
          <figcaption>{ele.caption}</figcaption>
        </figure>
      </a>
    </div>
  );
}