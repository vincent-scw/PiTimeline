using Microsoft.Extensions.Logging;
using PiTimeline.Shared.Utilities;

namespace PiTimeline.Background
{
    public class VideoThumbnailService : ThumbnailCreationServiceBase
    {
        public VideoThumbnailService(
            MediaUtilities mediaUtilities,
            ILogger<VideoThumbnailService> logger)
            : base(mediaUtilities, logger)
        { }

        // Allow 1 thread for ffmpeg
        protected override int MaxConcurrentFactor => 1;
    }
}
