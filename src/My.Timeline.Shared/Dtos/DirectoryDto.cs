namespace MyTimeline.Shared.Dtos
{
    public class DirectoryDto
    {
        public string Path { get; set; }
        public IList<DirectoryDto>? Directories { get; set; }
        public IList<PhotoDto>? Photos { get; set; }
    }
}
