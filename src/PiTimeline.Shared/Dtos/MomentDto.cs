namespace PiTimeline.Shared.Dtos
{
    public class MomentDto
    {
        public string? Id { get; set; }
        public string? TimelineId { get; set; }
        public string? Content { get; set; }
        public DateTime TakePlaceAtDateTime { get; set; }
    }
}
