import React from "react";
import { GalleryCtl } from "./GalleryCtl";

export interface PopupGalleryProps {
  itemSelected: Function;
}

export const PopupGallery: React.FC<PopupGalleryProps> = (props) => {
  return (
    <div className="popup-gallery">
      <GalleryCtl itemSelected={(item) => props.itemSelected(item)} selectable={true} />
    </div>
  )
}