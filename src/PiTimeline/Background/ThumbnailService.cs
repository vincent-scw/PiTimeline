using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Utilities;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PiTimeline.Background
{
    public class ThumbnailService
    {
        private readonly ILogger<ThumbnailService> _logger;
        private readonly GalleryConfiguration _configuration;
        private readonly string _allHandlingExtensions;

        private readonly PhotoThumbnailService _photoService;
        private readonly VideoThumbnailService _videoService;

        public ThumbnailService(
            IOptions<GalleryConfiguration> options,
            PhotoThumbnailService photoService,
            VideoThumbnailService videoService,
            ILogger<ThumbnailService> logger)
        {
            _logger = logger;
            _configuration = options.Value;
            _photoService = photoService;
            _videoService = videoService;

            _allHandlingExtensions = $"{_configuration.PhotoExtensions}|{_configuration.VideoExtensions}";
        }

        public async Task<string> GetThumbnailPathAsync(string input, int resolutionFactor)
        {
            var (origin, output) = GetThumbnailPath(input, resolutionFactor);
            var originFile = new FileInfo(origin);

            if (!originFile.Exists)
                throw new FileNotFoundException(origin);

            var destFile = new FileInfo(output);
            if (destFile.Exists && originFile.LastWriteTime <= destFile.LastWriteTime)
            {
                // Already created
                return output;
            }

            var extension = Path.GetExtension(origin);
            if (_configuration.PhotoExtensions.Contains(extension, StringComparison.InvariantCultureIgnoreCase))
            {
                await _photoService.EnqueueAndWaitAsync(origin, output, resolutionFactor, MediaType.Photo);
            }
            else
            {
                await _videoService.EnqueueAndWaitAsync(origin, output, resolutionFactor, MediaType.Video);
            }

            return output;
        }

        private (string origin, string output) GetThumbnailPath(string input, int resolutionFactor)
        {
            // Origin file path
            var originPath = Path.Combine(
                _configuration.PhotoRoot, 
                input.Replace('/', Path.DirectorySeparatorChar));
            // Output thumbnail path
            var output = Path.Combine(
                _configuration.ThumbnailRoot, 
                input.Replace('/', Path.DirectorySeparatorChar) + $".{resolutionFactor}.jpg");

            if (Directory.Exists(originPath))
            {
                // If it is a directory, get first media path
                originPath = Path.Combine(originPath, GetFirstMediaInDirectory(originPath));
                output = Path.Combine(_configuration.ThumbnailRoot, 
                    Path.GetRelativePath(_configuration.PhotoRoot, originPath));
            }

            return (originPath, output);
        }

        private string GetFirstMediaInDirectory(string path)
        {
            var firstFile = GetFirstMediaRecursively(path);
            if (firstFile == null)
                return null;

            return Path.GetRelativePath(path, firstFile);
        }

        private string GetFirstMediaRecursively(string path)
        {
            var firstFile = Directory.GetFiles(path)
                .Where(x => _allHandlingExtensions.Contains(Path.GetExtension(x).ToLower()))
                .FirstOrDefault();

            if (firstFile != null)
                return firstFile;

            var subDirs = Directory.GetDirectories(path);
            foreach (var dir in subDirs)
            {
                var file = GetFirstMediaRecursively(dir);
                if (file != null)
                    return file;
            }

            return null;
        }
    }
}
