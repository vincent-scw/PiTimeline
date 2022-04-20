import React from "react";
import { GalleryCtl } from "./GalleryCtl";
import { selectLatestDir } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { fetchDir } from "../../services";

export interface PopupGalleryProps {
  itemSelected: Function;
}

export const PopupGallery: React.FC<PopupGalleryProps> = (props) => {
  const dispatch = useDispatch();
  const latestDir = useSelector(selectLatestDir);

  const routeSelect = (path: string) => {
    dispatch(fetchDir(path));
  }

  const buildRoute = () => {
    const segments = latestDir.split('/');
    const segObj = segments.reduce((x, y) => {
      const last = x.at(-1);
      if (last) {
        x.push(`${last}/${y}`);
      } else {
        x.push(y);
      }
      return x;
    }, []);

    return segments.map((ps, index) => (
      <li key={ps}>
        <a onClick={() => routeSelect(segObj[index])}>{ps}</a>
      </li>
    ));
  }

  return (
    <div className="popup-gallery">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a onClick={() => routeSelect('')}>
              <span className="icon">
                <FontAwesomeIcon icon={faImages} />
              </span>
              <span>Gallery</span>
            </a>
          </li>
          {latestDir && buildRoute()}
        </ul>
      </nav>

      <GalleryCtl
        itemSelected={(item) => props.itemSelected(item)}
        selectable={true}
        directorySrc={latestDir}
      />
    </div>
  )
}