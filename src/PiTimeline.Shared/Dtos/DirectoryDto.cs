namespace PiTimeline.Shared.Dtos
{
    public class DirectoryDto : PhotoDto
    {
        public string? ThumbnailCaption { get; set; }
        public IList<DirectoryDto>? SubDirectories { get; set; }
        public IList<PhotoDto>? Items { get; set; }
    }
}
