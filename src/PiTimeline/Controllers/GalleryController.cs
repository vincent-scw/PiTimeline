using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PiTimeline.Infrastructure.Media;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using PiTimeline.Infrastructure.Services;

namespace PiTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private readonly GalleryConfiguration _configuration;
        private readonly IDirectoryMetadataBuilder _indexBuilder;
        private readonly IThumbnailService _thumbnailService;
        private readonly IMediaHandler _mediaHandler;

        public GalleryController(
            IOptions<GalleryConfiguration> options,
            IDirectoryMetadataBuilder indexBuilder,
            IThumbnailService thumbnailService,
            IMediaHandler mediaHandler)
        {
            _configuration = options.Value;
            _indexBuilder = indexBuilder;
            _thumbnailService = thumbnailService;
            _mediaHandler = mediaHandler;
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
                var mediaType = _mediaHandler.GetMediaType(absolutePath);
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
