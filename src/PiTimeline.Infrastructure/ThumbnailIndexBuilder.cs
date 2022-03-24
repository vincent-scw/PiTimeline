using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using PiTimeline.Shared.Utilities;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PiTimeline.Infrastructure
{
    public class ThumbnailIndexBuilder
    {
        private const string ThumbnailPrefix = "Thumbnail";
        private const int FixedThumbnailHeight = 200;
        private const int FixedDirectoryThumbnailHeight = 120;
        private const string IndexFileName = "index.json";
        private readonly GalleryConfiguration _configuration;

        public ThumbnailIndexBuilder(IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.PhotoRoot))
                throw new DirectoryNotFoundException($"Root path not found {options.Value.PhotoRoot}.");

            _configuration = options.Value;
        }

        public IndexDto BuildIndex(string dirPath)
        {
            // try get existing index
            if (TryGetExistingIndex(dirPath, out IndexDto dto))
            {
                return dto;
            }

            var allFiles = Directory.GetFiles(dirPath);
            var allHandlingExtensions = $"{_configuration.ImageExtensions}|{_configuration.VideoExtensionss}";
            var needToHandle = allFiles.Where(x => allHandlingExtensions.Contains(Path.GetExtension(x)));

            var items = needToHandle.Select(x => new IndexItemDto(Path.GetFileName(x))).ToList();
            items.AsParallel().ForAll(x => BuildItem(dirPath, x));

            var subDirs = Directory.GetDirectories(dirPath);
            var dirs = subDirs.Select(x => new IndexItemDto(Path.GetFileName(x))).ToList();
            dirs.AsParallel().ForAll(x => BuildDirectory(dirPath, x));

            dto = new IndexDto
            {
                SubDirectories = dirs,
                Items = items
            };

            StoreAsIndexFile(dirPath, dto);

            return dto;
        }

        private bool TryGetExistingIndex(string dirPath, out IndexDto dto)
        {
            var indexFile = Path.Combine(ToThumbnailPath(dirPath), IndexFileName);
            if (!File.Exists(indexFile))
            {
                dto = null;
                return false;
            }

            try
            {
                using FileStream fs = new FileStream(indexFile, FileMode.Open);
                dto = JsonSerializer.Deserialize<IndexDto>(fs, new JsonSerializerOptions());
                return true;
            }
            catch
            {
                dto = null;
                return false;
            }
        }

        private void StoreAsIndexFile(string dirPath, IndexDto dto)
        {
            var indexFile = Path.Combine(ToThumbnailPath(dirPath), IndexFileName);

            try
            {
                using FileStream fs = new FileStream(indexFile, FileMode.OpenOrCreate);
                JsonSerializer.Serialize(fs, dto,
                    new JsonSerializerOptions() { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
            }
            catch{}
        }

        private void BuildItem(string path, IndexItemDto item)
        {
            var filePath = Path.Combine(path, item.Name);
            item.ThumbnailWidth = ThumbnailUtility.GetWidthForFixedHeight(filePath, FixedThumbnailHeight);
            item.ThumbnailHeight = FixedThumbnailHeight;
        }

        private void BuildDirectory(string path, IndexItemDto dir)
        {
            var firstFile = GetFirstPhotoInDirectory(Path.Combine(path, dir.Name));

            if (firstFile == null)
                return;

            dir.Thumbnail = Path.Combine(dir.Name, firstFile.Thumbnail);
            dir.ThumbnailHeight = firstFile.ThumbnailHeight;
            dir.ThumbnailWidth = firstFile.ThumbnailWidth;
        }

        private string ToThumbnailPath(string absolutePath)
        {
            var relative = Path.GetRelativePath(_configuration.PhotoRoot, absolutePath);
            if (relative == ".")
                relative = string.Empty;
            return Path.Combine(_configuration.ThumbnailRoot, relative);
        }

        private IndexItemDto GetFirstPhotoInDirectory(string path)
        {
            var firstFile = GetFirstItemRecursively(path);
            if (firstFile == null)
                return null;

            return new IndexItemDto(firstFile)
            {
                Thumbnail = Path.GetRelativePath(path, firstFile),
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
