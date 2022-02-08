export interface TimelineSummary {
  id: string;
  title: string;
  description: string;
  snapshot: string;
}

export interface Moment {
  id: string;
  content: string;
  dateTime: Date;
}

export interface TimelineDetail {
  id: string;
  title: string;
  description: string;
  moments?: Moment[];
  isCompleted?: boolean;
}