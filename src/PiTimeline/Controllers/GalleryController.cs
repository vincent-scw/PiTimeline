using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using PiTimeline.Shared.Utilities;

namespace PiTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private const string ThumbnailPrefix = "Thumbnail";
        private const int FixedThumbnailHeight = 200;
        private const int FixedDirectoryThumbnailHeight = 120;
        private readonly GalleryConfiguration _configuration;

        public GalleryController(IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.PhotoRoot))
                throw new DirectoryNotFoundException($"Root path not found {options.Value.PhotoRoot}.");

            _configuration = options.Value;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var dto = BuildDirectoryDto(_configuration.PhotoRoot);

            return Ok(dto);
        }

        [HttpGet("{path}")]
        public async Task<IActionResult> HandlePath(string path)
        {
            var absolutePath = UrlToLocal(path, out bool isThumbnail);

            if (Directory.Exists(absolutePath))
            {
                var dto = BuildDirectoryDto(absolutePath);

                return Ok(dto);
            }

            if (isThumbnail && !System.IO.File.Exists(absolutePath))
            {
                // When thumbnail doesn't exist, create it
                var photoPath = Path.Combine(
                    _configuration.PhotoRoot, 
                    path[(ThumbnailPrefix.Length + 1)..].Replace('/', Path.DirectorySeparatorChar));
                await Task.Run(() => ThumbnailUtility.CreateThumbnail(photoPath, absolutePath));
            }

            if (System.IO.File.Exists(absolutePath))
            {
                var img = System.IO.File.OpenRead(absolutePath);
                return File(img, "image/jpeg");
            }

            return NotFound(path);
        }

        private string BuildUrl(string absolutePath, bool isThumbnail)
        {
            var relative = Path.GetRelativePath(_configuration.PhotoRoot, absolutePath)
                .Replace(Path.DirectorySeparatorChar, '/');
            return isThumbnail ? $"{ThumbnailPrefix}/{relative}" : relative;
        }

        private string BuildApiUrl(string absolutePath, bool isThumbnail)
        {
            return $"api/Gallery/{BuildUrl(absolutePath, isThumbnail)}";
        }

        private string UrlToLocal(string path, out bool isThumbnail)
        {
            isThumbnail = path.StartsWith(ThumbnailPrefix);
            var absolutePath = Path.Combine(
                isThumbnail ? _configuration.ThumbnailRoot : _configuration.PhotoRoot,
                isThumbnail ? path[(ThumbnailPrefix.Length + 1)..].Replace('/', Path.DirectorySeparatorChar) : path);

            return absolutePath;
        }

        private DirectoryDto BuildDirectoryDto(string absolutePath)
        {
            return new DirectoryDto()
            {
                SubDirectories = Directory.GetDirectories(absolutePath).Select(x =>
                {
                    var firstFile = GetFirstPhotoInDirectory(x);
                    return new DirectoryDto
                    {
                        ThumbnailCaption = Path.GetFileName(x),
                        Src = BuildUrl(x, false),
                        Thumbnail = firstFile?.Thumbnail,
                        ThumbnailHeight = firstFile?.ThumbnailHeight,
                        ThumbnailWidth = firstFile?.ThumbnailWidth,
                    };
                }).ToList(),
                Items = Directory.GetFiles(absolutePath).Select(x => new PhotoDto
                {
                    Src = BuildApiUrl(x, false),
                    Thumbnail = BuildApiUrl(x, true),
                    ThumbnailWidth = ThumbnailUtility.GetWidthForFixedHeight(x, FixedThumbnailHeight),
                    ThumbnailHeight = FixedThumbnailHeight
                }).ToList()
            };
        }

        private PhotoDto GetFirstPhotoInDirectory(string path)
        {
            var firstFile = GetFirstPhotoRecursively(path);
            if (firstFile == null)
                return null;

            return new PhotoDto()
            {
                Thumbnail = BuildApiUrl(firstFile, true),
                ThumbnailWidth = ThumbnailUtility.GetWidthForFixedHeight(firstFile, FixedDirectoryThumbnailHeight),
                ThumbnailHeight = FixedDirectoryThumbnailHeight
            };
        }

        private string GetFirstPhotoRecursively(string path)
        {
            var firstFile = Directory.GetFiles(path).FirstOrDefault();
            if (firstFile != null)
                return firstFile;

            var subDirs = Directory.GetDirectories(path);
            foreach (var dir in subDirs)
            {
                var file = GetFirstPhotoRecursively(dir);
                if (file != null)
                    return file;
            }

            return null;
        }
    }
}
