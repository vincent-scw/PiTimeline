using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MyTimeline.Shared.Configuration;
using MyTimeline.Shared.Dtos;

namespace MyTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private readonly GalleryConfiguration _configuration;

        public GalleryController(IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.RootPath))
                throw new DirectoryNotFoundException("Root path not found.");

            _configuration = options.Value;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var dto = new DirectoryDto()
            {
                Directories = Directory.GetDirectories(_configuration.RootPath)
                    .Select(x => new DirectoryDto { Path = BuildPath(x) }).ToList(),
                Photos = Directory.GetFiles(_configuration.RootPath).Select(x => new PhotoDto { Src = BuildPath(x) })
                    .ToList()
            };

            return Ok(dto);
        }

        [HttpGet("{path}")]
        public async Task<IActionResult> HandlePath(string path)
        {
            var absolutePath = Path.Combine(_configuration.RootPath, path);

            if (Directory.Exists(absolutePath))
            {
                var dto = new DirectoryDto()
                {
                    Directories = Directory.GetDirectories(absolutePath)
                        .Select(x => new DirectoryDto { Path = BuildPath(x) }).ToList(),
                    Photos = Directory.GetFiles(absolutePath).Select(x => new PhotoDto { Src = BuildPath(x) })
                        .ToList()
                };

                return Ok(dto);
            }
            else if (System.IO.File.Exists(absolutePath))
            {
                var img = System.IO.File.OpenRead(absolutePath);
                return File(img, "image/jpeg");
            }

            return NotFound(path);
        }

        private string BuildPath(string absolutePath)
        {
            var relative = Path.GetRelativePath(_configuration.RootPath, absolutePath)
                .Replace('\\', '/');
            return $"api/Gallery/{relative}";
        }
    }
}
