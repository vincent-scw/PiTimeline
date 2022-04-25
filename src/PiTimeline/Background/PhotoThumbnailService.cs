using Microsoft.Extensions.Logging;
using PiTimeline.Shared.Utilities;
using System;
using System.Threading.Tasks;

namespace PiTimeline.Background
{
    public class PhotoThumbnailService : ThumbnailService
    {
        public PhotoThumbnailService(ILogger<PhotoThumbnailService> logger)
            : base(logger)
        { }

        protected override int MaxConcurrentFactor => 5;

        protected override Func<string, string, Task> GenerateThumbnail =>
            (input, output) =>
                ThumbnailUtility.CreateThumbnailAsync(
                    input,
                    output,
                    MediaType.Photo);
    }
}
