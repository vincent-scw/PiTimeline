using Microsoft.Extensions.Logging;

namespace PiTimeline.Background
{
    public class VideoThumbnailService : ThumbnailCreationServiceBase
    {
        public VideoThumbnailService(
            ILogger<VideoThumbnailService> logger)
            : base(logger)
        { }

        // Allow 1 thread for ffmpeg
        protected override int MaxConcurrentFactor => 1;
    }
}
