using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PiTimeline.Background;
using PiTimeline.Infrastructure;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PiTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private readonly GalleryConfiguration _configuration;
        private readonly DirectoryMetadataBuilder _indexBuilder;
        private readonly ThumbnailService _thumbnailService;

        public GalleryController(
            IOptions<GalleryConfiguration> options,
            DirectoryMetadataBuilder indexBuilder,
            ThumbnailService thumbnailService)
        {
            _configuration = options.Value;
            _indexBuilder = indexBuilder;
            _thumbnailService = thumbnailService;
        }

        [Authorize]
        [HttpGet("d/{path}")]
        public async Task<IActionResult> HandleDir(string path)
        {
            var p = path == null ? string.Empty : path;
            var absolutePath = UrlToLocal(p, false);

            if (Directory.Exists(absolutePath))
            {
                var dto = _indexBuilder.BuildMeta(absolutePath);

                return Ok(Map(p, dto));
            }

            return NotFound(p);
        }

        [HttpGet("f/{path}")]
        public async Task<IActionResult> HandleFile(string path, [FromQuery] int res)
        {
            var thumbnail = res > 0;
            var absolutePath = UrlToLocal(path, thumbnail);

            if (thumbnail)
            {
                absolutePath = await _thumbnailService.GetThumbnailPathAsync(path, res);
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
                Path = path,
                Media = index.Media.Select(x => new MediaDto
                {
                    Name = x.Name,
                    Path = Path.Combine(path, x.Name),
                    Type = _configuration.PhotoExtensions.Contains(Path.GetExtension(x.Name), System.StringComparison.InvariantCultureIgnoreCase) 
                        ? MediaType.Photo : MediaType.Video
                }).ToList(),
                SubDirectories = index.SubDirectories.Select(x => new DirectoryDto()
                {
                    Name = x.Name,
                    Path = BuildUrl(Path.Combine(path, x.Name)), // Path is used for UI route
                }).ToList(),
            };

            return dir;
        }

        private string BuildUrl(string path)
        {
            var relative = path.Replace(Path.DirectorySeparatorChar, '/');
            if (relative == ".")
                relative = string.Empty;
            return relative;
        }

        private string UrlToLocal(string path, bool isThumbnail)
        {
            var absolutePath = Path.Combine(
                isThumbnail ? _configuration.ThumbnailRoot : _configuration.PhotoRoot,
                path.Replace('/', Path.DirectorySeparatorChar));

            return absolutePath;
        }
    }
}
