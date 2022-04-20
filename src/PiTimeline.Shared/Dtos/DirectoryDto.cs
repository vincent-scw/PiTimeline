namespace PiTimeline.Shared.Dtos
{
    public class DirectoryDto : ItemDto
    {
        public string? Path { get; set; }
        public string? Caption { get; set; }
        public IList<DirectoryDto>? SubDirectories { get; set; }
        public IList<ItemDto>? Items { get; set; }
    }
}
