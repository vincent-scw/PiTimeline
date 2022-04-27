using Microsoft.Extensions.Logging;

namespace PiTimeline.Background
{
    public class PhotoThumbnailService : ThumbnailCreationServiceBase
    {
        public PhotoThumbnailService(
            ILogger<PhotoThumbnailService> logger)
            : base(logger)
        { }

        protected override int MaxConcurrentFactor => 5;
    }
}
