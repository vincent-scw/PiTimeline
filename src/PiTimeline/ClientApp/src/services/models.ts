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

export enum MediaType {
  Photo = 0,
  Video = 1
}

export interface Media {
  name: string;
  path?: string;
  metadata?: Metadata;
}

export interface Metadata {
  size?: Size;
  fileSize?: number;
  type: MediaType
}

export interface Size {
  width?: number;
  height?: number;
}

export interface DirectoryInfo extends Media {
  subDirectories?: DirectoryInfo[];
  media?: Media[];
}

export type GroupedMoments = {
  group: string;
  moments: Moment[];
}

export type Credentials = {
  username: string;
  password?: string;
}