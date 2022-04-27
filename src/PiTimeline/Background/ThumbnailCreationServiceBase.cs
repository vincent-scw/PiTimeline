using Microsoft.Extensions.Logging;
using PiTimeline.Shared.Utilities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PiTimeline.Background
{
    public abstract class ThumbnailCreationServiceBase
    {
        private readonly ILogger _logger;
        private readonly SemaphoreSlim _semaphoreSlim;
        public ThumbnailCreationServiceBase(ILogger logger)
        {
            _logger = logger;
            _semaphoreSlim = new SemaphoreSlim(MaxConcurrentFactor);
        }

        protected abstract int MaxConcurrentFactor { get; }

        public async Task EnqueueAndWaitAsync(string input, string output, int resolutionFactor, MediaType mediaType)
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                await ThumbnailUtility.CreateThumbnailAsync(
                    input,
                    output,
                    resolutionFactor != 720 ? 240 : 720, // only support 240 or 720
                    mediaType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }
    }
}
