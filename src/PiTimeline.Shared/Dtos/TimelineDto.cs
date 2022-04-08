using System.ComponentModel.DataAnnotations;

namespace PiTimeline.Shared.Dtos
{
    public class TimelineDto
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public DateTime? Since { get; set; }
        public string? CoverPatternUrl { get; set; }
        public DateTime? LastUpdatedDateTime { get; set; }

        public IList<MomentDto>? Moments { get; set; }
    }
}
