using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PiTimeline.Infrastructure;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using PiTimeline.Shared.Utilities;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PiTimeline.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private const string ThumbnailPrefix = "Thumbnail";
        private readonly GalleryConfiguration _configuration;
        private readonly ThumbnailIndexBuilder _indexBuilder;

        public GalleryController(
            IOptions<GalleryConfiguration> options,
            ThumbnailIndexBuilder indexBuilder)
        {
            _configuration = options.Value;
            _indexBuilder = indexBuilder;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var dto = _indexBuilder.BuildIndex(_configuration.PhotoRoot);

            return Ok(Map(string.Empty, dto));
        }

        [HttpGet("{path}")]
        public async Task<IActionResult> HandlePath(string path)
        {
            var absolutePath = UrlToLocal(path, out bool isThumbnail);

            if (Directory.Exists(absolutePath))
            {
                var dto = _indexBuilder.BuildIndex(absolutePath);

                return Ok(Map(path, dto));
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

        private DirectoryDto Map(string path, IndexDto index)
        {
            var dir = new DirectoryDto
            {
                Items = index.Items.Select(x => new ItemDto
                {
                    Src = BuildApiUrl(Path.Combine(path, x.Name), false),
                    Thumbnail = BuildApiUrl(Path.Combine(path, x.Name), true),
                    ThumbnailHeight = x.ThumbnailHeight,
                    ThumbnailWidth = x.ThumbnailWidth
                }).ToList(),
                SubDirectories = index.SubDirectories.Select(x => new DirectoryDto()
                {
                    ThumbnailCaption = x.Name,
                    Src = BuildApiUrl(Path.Combine(path, x.Name), false),
                    Path = BuildUrl(Path.Combine(path, x.Name), false), // Path is used for UI route
                    Thumbnail = BuildApiUrl(Path.Combine(path, x.Thumbnail), true),
                    ThumbnailHeight = x.ThumbnailHeight,
                    ThumbnailWidth = x.ThumbnailWidth
                }).ToList(),
            };

            return dir;
        }

        /// <summary>
        /// Build url for file/directory
        /// </summary>
        /// <param name="absolutePath"></param>
        /// <param name="isThumbnail"></param>
        /// <returns></returns>
        private string BuildUrl(string path, bool isThumbnail)
        {
            var relative = path.Replace(Path.DirectorySeparatorChar, '/');
            if (relative == ".")
                relative = string.Empty;
            return isThumbnail ? $"{ThumbnailPrefix}/{relative}" : relative;
        }

        /// <summary>
        /// Append api url
        /// </summary>
        /// <param name="absolutePath"></param>
        /// <param name="isThumbnail"></param>
        /// <returns></returns>
        private string BuildApiUrl(string path, bool isThumbnail)
        {
            return $"api/Gallery/{BuildUrl(path, isThumbnail)}";
        }

        private string UrlToLocal(string path, out bool isThumbnail)
        {
            isThumbnail = path.StartsWith(ThumbnailPrefix);
            var absolutePath = Path.Combine(
                isThumbnail ? _configuration.ThumbnailRoot : _configuration.PhotoRoot,
                isThumbnail ? path[(ThumbnailPrefix.Length + 1)..].Replace('/', Path.DirectorySeparatorChar) : path);

            return absolutePath;
        }
    }
}
