namespace PiTimeline.Shared.Dtos
{
    public class DirectoryDto : ItemDto
    {
        public string? ThumbnailCaption { get; set; }
        public IList<DirectoryDto>? SubDirectories { get; set; }
        public IList<ItemDto>? Items { get; set; }
    }
}
