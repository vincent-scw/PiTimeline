﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
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

        public GalleryController(IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.PhotoRoot))
                throw new DirectoryNotFoundException("Root path not found.");

            _configuration = options.Value;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var dto = BuildDirectoryDto(_configuration.PhotoRoot);

            return Ok(dto);
        }

        [HttpGet("{path}")]
        public IActionResult HandlePath(string path)
        {
            var absolutePath = Path.Combine(_configuration.PhotoRoot, path);

            if (Directory.Exists(absolutePath))
            {
                var dto = BuildDirectoryDto(absolutePath);

                return Ok(dto);
            }

            if (System.IO.File.Exists(absolutePath))
            {
                var img = System.IO.File.OpenRead(absolutePath);
                return File(img, "image/jpeg");
            }

            return NotFound(path);
        }

        private string BuildPath(string absolutePath, bool isThumbnail)
        {
            var relative = Path.GetRelativePath(
                    isThumbnail ? _configuration.ThumbnailRoot : _configuration.PhotoRoot, absolutePath)
                .Replace('\\', '/');
            return $"api/Gallery/{relative}";
        }

        private DirectoryDto BuildDirectoryDto(string absolutePath)
        {
            return new DirectoryDto()
            {
                Directories = Directory.GetDirectories(absolutePath)
                    .Select(x => new DirectoryDto { Path = BuildPath(x, false) }).ToList(),
                Photos = Directory.GetFiles(absolutePath).Select(x => new PhotoDto
                    {
                        Src = BuildPath(x, false),
                        Thumbnail = BuildPath(x, true),
                        ThumbnailWidth = 320,
                        ThumbnailHeight = 174
                    })
                    .ToList()
            };
        }
    }
}
