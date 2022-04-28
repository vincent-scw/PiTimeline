using Microsoft.Extensions.Logging;
using PiTimeline.Shared.Utilities;

namespace PiTimeline.Background
{
    public class PhotoThumbnailService : ThumbnailCreationServiceBase
    {
        public PhotoThumbnailService(
            MediaUtilities mediaUtilities,
            ILogger<PhotoThumbnailService> logger)
            : base(mediaUtilities, logger)
        { }

        protected override int MaxConcurrentFactor => 5;
    }
}
