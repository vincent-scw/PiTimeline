using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PiTimeline.Background
{
    public abstract class ThumbnailService
    {
        private readonly ILogger _logger;

        private readonly SemaphoreSlim _semaphoreSlim;

        public ThumbnailService(ILogger logger)
        {
            _logger = logger;
            _semaphoreSlim = new SemaphoreSlim(MaxConcurrentFactor);
        }

        protected abstract int MaxConcurrentFactor { get; }
        protected abstract Func<string, string, Task> GenerateThumbnail { get; }

        public async Task<bool> EnqueueAndWaitAsync(string input, string output)
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                await GenerateThumbnail(input, output);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }
    }
}
