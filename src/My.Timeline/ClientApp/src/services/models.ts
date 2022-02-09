export interface Moment {
  id?: string;
  content?: string;
  dateTime?: Date;
}

export interface Timeline {
  id?: string;
  title?: string;
  description?: string;
  snapshot?: string;
  moments?: Moment[];
}