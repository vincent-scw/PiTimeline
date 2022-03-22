using System.Text.Json.Serialization;

namespace PiTimeline.Shared.Dtos
{
    public class ItemDto
    {
        public ItemDto(string path)
        {
            Path = path;
        }

        [JsonIgnore]
        public string? Path { get; }

        public string? Src { get; set; }
        public string? Thumbnail { get; set; }
        public int? ThumbnailWidth { get; set; }
        public int? ThumbnailHeight { get; set; }
    }
}
