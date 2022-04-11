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
  coverPatternUrl?: string;
  since?: Date;
  moments?: Moment[];
}

export interface ItemInfo {
  src: string;
  thumbnail?: string;
}

export interface DirectoryInfo extends ItemInfo {
  path?: string;
  subDirectories?: DirectoryInfo[];
  items?: ItemInfo[];
}

export type GroupedMoments = {
  group: string;
  moments: Moment[];
}