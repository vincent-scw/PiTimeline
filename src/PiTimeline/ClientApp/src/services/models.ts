export interface Moment {
  id?: string;
  timelineId?: string;
  content?: string;
  takePlaceAtDateTime?: Date;
}

export interface Timeline {
  id?: string;
  title?: string;
  description?: string;
  snapshot?: string;
  moments?: Moment[];
}

export interface ItemInfo {
  src: string;
  thumbnail?: string;
}

export interface DirectoryInfo extends ItemInfo {
  subDirectories?: DirectoryInfo[];
  items?: ItemInfo[];
}