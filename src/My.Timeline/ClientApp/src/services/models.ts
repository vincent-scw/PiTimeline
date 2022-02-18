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
