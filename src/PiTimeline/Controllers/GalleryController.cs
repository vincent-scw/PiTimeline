using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PiTimeline.Infrastructure;
using PiTimeline.Services;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System.IO;
using System.Net.Http.Headers;
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
        private readonly MediaHandler _mediaUtilities;

        public GalleryController(
            IOptions<GalleryConfiguration> options,
            DirectoryMetadataBuilder indexBuilder,
            ThumbnailService thumbnailService,
            MediaHandler mediaUtilities)
        {
            _configuration = options.Value;
            _indexBuilder = indexBuilder;
            _thumbnailService = thumbnailService;
            _mediaUtilities = mediaUtilities;
        }

        [Authorize]
        [HttpGet("d/{path}")]
        public IActionResult HandleDir(string path)
        {
            var p = path == null ? string.Empty : path;
            var absolutePath = UrlToLocal(p, false);

            if (Directory.Exists(absolutePath))
            {
                var dto = _indexBuilder.BuildMetadata(absolutePath);

                return Ok(dto);
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
                var mediaType = _mediaUtilities.GetMediaType(absolutePath);
                if (mediaType == MediaType.Video && !thumbnail)
                {
                    var video = System.IO.File.OpenRead(absolutePath);
                    return File(
                        fileStream: video,
                        contentType: new MediaTypeHeaderValue("video/mp4").MediaType,
                        enableRangeProcessing: true //<-- enable range requests processing
                    );
                }
                else
                {
                    var img = System.IO.File.OpenRead(absolutePath);
                    return File(img, "image/jpeg");
                }
            }

            return NotFound(path);
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
