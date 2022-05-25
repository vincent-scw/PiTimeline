using System.Threading.Tasks;
using PiTimeline.Shared.Dtos;

namespace PiTimeline.Infrastructure.Media
{
    public interface IMediaHandler
    {
        Task CreateThumbnailAsync(
            string originPath,
            string outputPath,
            int resolutionFactor);

        MediaType GetMediaType(string path);

        MetadataDto GetMetadata(string path);
    }
}
