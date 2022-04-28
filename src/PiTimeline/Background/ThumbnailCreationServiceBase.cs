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
        private readonly MediaUtilities _mediaUtilities;
        private readonly SemaphoreSlim _semaphoreSlim;
        public ThumbnailCreationServiceBase(MediaUtilities mediaUtilities, ILogger logger)
        {
            _mediaUtilities = mediaUtilities;
            _logger = logger;
            _semaphoreSlim = new SemaphoreSlim(MaxConcurrentFactor);
        }

        protected abstract int MaxConcurrentFactor { get; }

        public async Task EnqueueAndWaitAsync(string input, string output, int resolutionFactor)
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                await _mediaUtilities.CreateThumbnailAsync(
                    input,
                    output,
                    resolutionFactor
                );
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
