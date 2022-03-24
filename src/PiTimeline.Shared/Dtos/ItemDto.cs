using System.Text.Json.Serialization;

namespace PiTimeline.Shared.Dtos
{
    public class ItemDto
    {
        public string? Src { get; set; }
        public string? Thumbnail { get; set; }
        public int? ThumbnailWidth { get; set; }
        public int? ThumbnailHeight { get; set; }
    }
}
