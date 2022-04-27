using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PiTimeline.Infrastructure
{
    public class DirectoryMetadataBuilder
    {
        private const string IndexFileName = "index.json";
        private readonly GalleryConfiguration _configuration;
        private readonly string _allHandlingExtensions;

        public DirectoryMetadataBuilder(IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.PhotoRoot))
                throw new DirectoryNotFoundException($"Root path not found {options.Value.PhotoRoot}.");

            _configuration = options.Value;
            _allHandlingExtensions = $"{_configuration.PhotoExtensions}|{_configuration.VideoExtensions}";
        }

        public IndexDto BuildMeta(string dirPath)
        {
            // try get existing index
            //if (TryGetExistingIndex(dirPath, out IndexDto dto))
            //{
            //    return dto;
            //}

            var allFiles = Directory.GetFiles(dirPath);
            var needToHandle = allFiles.Where(x => _allHandlingExtensions.Contains(Path.GetExtension(x).ToLower()));

            var items = needToHandle.Select(x => new IndexItemDto(Path.GetFileName(x))).ToList();

            var subDirs = Directory.GetDirectories(dirPath);
            var dirs = subDirs.Select(x => new IndexItemDto(Path.GetFileName(x))).ToList();

            var dto = new IndexDto
            {
                SubDirectories = dirs,
                Media = items
            };

            //StoreAsIndexFile(dirPath, dto);

            return dto;
        }

        private bool TryGetExistingIndex(string dirPath, out IndexDto dto)
        {
            var indexFile = new FileInfo(Path.Combine(ToThumbnailPath(dirPath), IndexFileName));
            var dirInfo = new DirectoryInfo(dirPath);
            if (!indexFile.Exists || dirInfo.LastWriteTime > indexFile.LastWriteTime)
            {
                dto = null;
                return false;
            }

            try
            {
                using var fs = indexFile.OpenRead();
                
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

        private string ToThumbnailPath(string absolutePath)
        {
            var relative = Path.GetRelativePath(_configuration.PhotoRoot, absolutePath);
            if (relative == ".")
                relative = string.Empty;
            return Path.Combine(_configuration.ThumbnailRoot, relative);
        }
    }
}
