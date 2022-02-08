﻿namespace MyTimeline.Shared.Dtos
{
    public class TimelineDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime Since { get; set; }
        public DateTime LastUpdatedDateTime { get; set; }
    }
}