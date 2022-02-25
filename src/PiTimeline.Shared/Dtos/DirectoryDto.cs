namespace PiTimeline.Shared.Dtos
{
    public class DirectoryDto : PhotoDto
    {
        public string? ThumbnailCaption { get; set; }
        public IList<DirectoryDto>? Directories { get; set; }
        public IList<PhotoDto>? Photos { get; set; }
    }
}
