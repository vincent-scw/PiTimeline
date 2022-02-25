namespace PiTimeline.Shared.Dtos
{
    public class DirectoryDto : PhotoDto
    {
        public string? Caption { get; set; }
        public IList<DirectoryDto>? Directories { get; set; }
        public IList<PhotoDto>? Photos { get; set; }
    }
}
