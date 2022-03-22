using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using PiTimeline.Infrastructure;
using PiTimeline.Shared.Utilities;

namespace PiTimeline.Controllers
{
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

            return Ok(dto);
        }

        [HttpGet("{path}")]
        public async Task<IActionResult> HandlePath(string path)
        {
            var absolutePath = UrlToLocal(path, out bool isThumbnail);

            if (Directory.Exists(absolutePath))
            {
                var dto = _indexBuilder.BuildIndex(absolutePath);

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
