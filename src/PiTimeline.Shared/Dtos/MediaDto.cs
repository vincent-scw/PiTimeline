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
        public MetadataDto? Metadata { get; set; }
    }

    public class MetadataDto
    {
        public MediaType? Type { get; set; }
        public DateTime? CreationTime { get; set; }
        public long? FileSize { get; set; }
        public SizeDto? Size { get; set; }
    }

    public class SizeDto
    { 
        public int? Width { get; set; }
        public int? Height { get; set; }
    }
}
