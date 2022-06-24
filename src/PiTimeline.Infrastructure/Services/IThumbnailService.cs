using System.Threading.Tasks;

namespace PiTimeline.Infrastructure.Services
{
    public interface IThumbnailService
    {
        Task<string> GetThumbnailPathAsync(string input, int resolutionFactor);
    }
}
