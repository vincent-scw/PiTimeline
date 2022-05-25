using System.IO;
using System.Linq;
using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;

namespace PiTimeline.Infrastructure.Media
{
    public class DirectoryMetadataBuilder : IDirectoryMetadataBuilder
    {
        private readonly GalleryConfiguration _configuration;
        private readonly IMediaHandler _mediaUtilities;
        private readonly string _allHandlingExtensions;

        public DirectoryMetadataBuilder(
            IMediaHandler mediaUtilities,
            IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.PhotoRoot))
                throw new DirectoryNotFoundException($"Root path not found {options.Value.PhotoRoot}.");

            _mediaUtilities = mediaUtilities;
            _configuration = options.Value;
            _allHandlingExtensions = $"{_configuration.PhotoExtensions}|{_configuration.VideoExtensions}";
        }

        public DirectoryDto BuildMetadata(string dirPath)
        {
            var allFiles = Directory.GetFiles(dirPath);
            var needToHandle = allFiles.Where(x => _allHandlingExtensions.Contains(Path.GetExtension(x).ToLower()));

            var items = needToHandle.Select(x => new MediaDto
            {
                Name = Path.GetFileName(x),
                Metadata = _mediaUtilities.GetMetadata(Path.Combine(dirPath, x)),
                Path = Path.GetRelativePath(_configuration.PhotoRoot, x).Replace(Path.DirectorySeparatorChar, '/')
            }).OrderBy(x => x.Metadata.CreationTime).ToList();

            var subDirs = Directory.GetDirectories(dirPath);
            var dirs = subDirs.Select(x => new DirectoryDto
            {
                Name = Path.GetFileName(x),
                Path = Path.GetRelativePath(_configuration.PhotoRoot, x).Replace(Path.DirectorySeparatorChar, '/')
            }).OrderBy(x => x.Name).ToList();

            var dto = new DirectoryDto
            {
                Path = Path.GetRelativePath(_configuration.PhotoRoot, dirPath),
                SubDirectories = dirs,
                Media = items
            };

            return dto;
        }
    }
}
