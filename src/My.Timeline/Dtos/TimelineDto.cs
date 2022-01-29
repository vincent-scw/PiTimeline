using System;

namespace MyTimeline.Dtos
{
    public class TimelineDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime LastUpdatedDateTime { get; set; }
    }
}
