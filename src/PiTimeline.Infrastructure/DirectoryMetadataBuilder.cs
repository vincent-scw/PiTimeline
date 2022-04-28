using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using PiTimeline.Shared.Utilities;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PiTimeline.Infrastructure
{
    public class DirectoryMetadataBuilder
    {
        private const string IndexFileName = "index.json";
        private readonly GalleryConfiguration _configuration;
        private readonly MediaUtilities _mediaUtilities;
        private readonly string _allHandlingExtensions;

        public DirectoryMetadataBuilder(
            MediaUtilities mediaUtilities,
            IOptions<GalleryConfiguration> options)
        {
            if (!Directory.Exists(options.Value.PhotoRoot))
                throw new DirectoryNotFoundException($"Root path not found {options.Value.PhotoRoot}.");

            _mediaUtilities = mediaUtilities;
            _configuration = options.Value;
            _allHandlingExtensions = $"{_configuration.PhotoExtensions}|{_configuration.VideoExtensions}";
        }

        public async Task<DirectoryDto> BuildMetaAsync(string dirPath)
        {
            // try get existing index
            //if (TryGetExistingIndex(dirPath, out IndexDto dto))
            //{
            //    return dto;
            //}

            var allFiles = Directory.GetFiles(dirPath);
            var needToHandle = allFiles.Where(x => _allHandlingExtensions.Contains(Path.GetExtension(x).ToLower()));

            var items = needToHandle.Select(x => new MediaDto
            {
                Name = Path.GetFileName(x),
                //Metadata = _mediaUtilities.GetMetadata(Path.Combine(dirPath, x)),
                Path = Path.GetRelativePath(_configuration.PhotoRoot, x).Replace(Path.DirectorySeparatorChar, '/')
            }).ToList();

            var subDirs = Directory.GetDirectories(dirPath);
            var dirs = subDirs.Select(x => new DirectoryDto
            {
                Name = Path.GetFileName(x),
                Path = Path.GetRelativePath(_configuration.PhotoRoot, x).Replace(Path.DirectorySeparatorChar, '/')
            }).ToList();

            var dto = new DirectoryDto
            {
                Path = Path.GetRelativePath(_configuration.PhotoRoot, dirPath),
                SubDirectories = dirs,
                Media = items
            };

            //StoreAsIndexFile(dirPath, dto);

            return dto;
        }

        private bool TryGetExistingIndex(string dirPath, out DirectoryDto dto)
        {
            var indexFile = new FileInfo(Path.Combine(ToLocalPath(dirPath), IndexFileName));
            var dirInfo = new DirectoryInfo(dirPath);
            if (!indexFile.Exists || dirInfo.LastWriteTime > indexFile.LastWriteTime)
            {
                dto = null;
                return false;
            }

            try
            {
                using var fs = indexFile.OpenRead();
                
                dto = JsonSerializer.Deserialize<DirectoryDto>(fs, new JsonSerializerOptions());
                return true;
            }
            catch
            {
                dto = null;
                return false;
            }
        }

        private void StoreAsIndexFile(string dirPath, DirectoryDto dto)
        {
            var indexFile = Path.Combine(ToLocalPath(dirPath), IndexFileName);

            try
            {
                using FileStream fs = new FileStream(indexFile, FileMode.OpenOrCreate);
                JsonSerializer.Serialize(fs, dto,
                    new JsonSerializerOptions() { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
            }
            catch{}
        }

        private string ToLocalPath(string absolutePath)
        {
            var relative = Path.GetRelativePath(_configuration.PhotoRoot, absolutePath);
            if (relative == ".")
                relative = string.Empty;
            return Path.Combine(_configuration.ThumbnailRoot, relative);
        }
    }
}
