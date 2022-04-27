namespace PiTimeline.Shared.Dtos
{
    public class DirectoryDto : MediaDto
    {
        public IList<DirectoryDto>? SubDirectories { get; set; }
        public IList<MediaDto>? Media { get; set; }
    }
}
