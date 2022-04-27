namespace PiTimeline.Shared.Dtos
{
    public enum MediaType
    {
        Photo,
        Video
    }

    public class MediaDto
    {
        public string? Name { get; set; }
        public string? Path { get; set; }
        public MediaType? Type { get; set; }
    }
}
