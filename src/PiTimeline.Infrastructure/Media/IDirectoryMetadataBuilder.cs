using PiTimeline.Shared.Dtos;

namespace PiTimeline.Infrastructure.Media
{
    public interface IDirectoryMetadataBuilder
    {
        DirectoryDto BuildMetadata(string dirPath);
    }
}
