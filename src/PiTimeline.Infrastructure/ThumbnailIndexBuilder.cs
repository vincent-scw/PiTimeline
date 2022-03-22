using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using PiTimeline.Shared.Utilities;
using System.IO;
using System.Linq;

namespace PiTimeline.Infrastructure
{
    public class ThumbnailIndexBuilder
    {
        private const string ThumbnailPrefix = "Thumbnail";
        private const int FixedThumbnailHeight = 200;
        private const int FixedDirectoryThumbnailHeight = 120;
        private readonly GalleryConfiguration _configuration;

        public ThumbnailIndexBuilder(IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.PhotoRoot))
                throw new DirectoryNotFoundException($"Root path not found {options.Value.PhotoRoot}.");

            _configuration = options.Value;
        }

        public DirectoryDto BuildIndex(string dirPath)
        {
            var allFiles = Directory.GetFiles(dirPath);
            var allHandlingExtensions = $"{_configuration.ImageExtensions}|{_configuration.VideoExtensionss}";
            var needToHandle = allFiles.Where(x => allHandlingExtensions.Contains(Path.GetExtension(x)));

            var items = needToHandle.Select(x => new ItemDto(x)).ToList();
            items.AsParallel().ForAll(BuildItem);

            var subDirs = Directory.GetDirectories(dirPath);
            var dirs = subDirs.Select(x => new DirectoryDto(x)).ToList();
            dirs.AsParallel().ForAll(BuildDirectory);

            var dto = new DirectoryDto(dirPath)
            {
                SubDirectories = dirs,
                Items = items
            };

            return dto;
        }

        private void BuildItem(ItemDto item)
        {
            item.Src = BuildApiUrl(item.Path, false);
            item.Thumbnail = BuildApiUrl(item.Path, true);
            item.ThumbnailWidth = ThumbnailUtility.GetWidthForFixedHeight(item.Path, FixedThumbnailHeight);
            item.ThumbnailHeight = FixedThumbnailHeight;
        }

        private void BuildDirectory(DirectoryDto dir)
        {
            var firstFile = GetFirstPhotoInDirectory(dir.Path);

            dir.ThumbnailCaption = Path.GetFileName(dir.Path);
            dir.Src = BuildUrl(dir.Path, false);
            dir.Thumbnail = firstFile?.Thumbnail;
            dir.ThumbnailHeight = firstFile?.ThumbnailHeight;
            dir.ThumbnailWidth = firstFile?.ThumbnailWidth;
        }

        /// <summary>
        /// Build url for file/directory
        /// </summary>
        /// <param name="absolutePath"></param>
        /// <param name="isThumbnail"></param>
        /// <returns></returns>
        private string BuildUrl(string absolutePath, bool isThumbnail)
        {
            var relative = Path.GetRelativePath(_configuration.PhotoRoot, absolutePath)
                .Replace(Path.DirectorySeparatorChar, '/');
            return isThumbnail ? $"{ThumbnailPrefix}/{relative}" : relative;
        }

        /// <summary>
        /// Append api url
        /// </summary>
        /// <param name="absolutePath"></param>
        /// <param name="isThumbnail"></param>
        /// <returns></returns>
        private string BuildApiUrl(string absolutePath, bool isThumbnail)
        {
            return $"api/Gallery/{BuildUrl(absolutePath, isThumbnail)}";
        }

        private ItemDto GetFirstPhotoInDirectory(string path)
        {
            var firstFile = GetFirstItemRecursively(path);
            if (firstFile == null)
                return null;

            return new ItemDto(firstFile)
            {
                Thumbnail = BuildApiUrl(firstFile, true),
                ThumbnailWidth = ThumbnailUtility.GetWidthForFixedHeight(firstFile, FixedDirectoryThumbnailHeight),
                ThumbnailHeight = FixedDirectoryThumbnailHeight
            };
        }

        private string GetFirstItemRecursively(string path)
        {
            var firstFile = Directory.GetFiles(path).FirstOrDefault();
            if (firstFile != null)
                return firstFile;

            var subDirs = Directory.GetDirectories(path);
            foreach (var dir in subDirs)
            {
                var file = GetFirstItemRecursively(dir);
                if (file != null)
                    return file;
            }

            return null;
        }
    }
}
