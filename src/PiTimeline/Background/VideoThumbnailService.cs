using Microsoft.Extensions.Logging;
using PiTimeline.Shared.Utilities;
using System;
using System.Threading.Tasks;

namespace PiTimeline.Background
{
    public class VideoThumbnailService : ThumbnailService
    {
        public VideoThumbnailService(ILogger<VideoThumbnailService> logger)
            : base(logger)
        { }

        // Allow 1 thread for ffmpeg
        protected override int MaxConcurrentFactor => 1;

        protected override Func<string, string, Task> GenerateThumbnail =>
            (input, output) =>
                ThumbnailUtility.CreateThumbnailAsync(
                    input,
                    output,
                    MediaType.Video);
    }
}
