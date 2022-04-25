using System.Text.Json.Serialization;

namespace PiTimeline.Shared.Dtos
{
    public class IndexDto
    {
        [JsonPropertyName("items")]
        public List<IndexItemDto> Items { get; set; }
        [JsonPropertyName("dirs")]
        public List<IndexItemDto> SubDirectories { get; set; }
    }

    public class IndexItemDto
    {
        public IndexItemDto(string name)
        {
            Name = name;
        }

        [JsonPropertyName("n")]
        public string Name { get; set; }
        [JsonPropertyName("t")]
        public string? Thumbnail { get; set; }
    }
}
