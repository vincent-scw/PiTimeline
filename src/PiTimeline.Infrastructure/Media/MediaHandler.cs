﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using FFMpegCore;
using MetadataExtractor;
using MetadataExtractor.Formats.Exif;
using MetadataExtractor.Formats.FileSystem;
using MetadataExtractor.Formats.FileType;
using MetadataExtractor.Formats.Jpeg;
using MetadataExtractor.Formats.QuickTime;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using SkiaSharp;

namespace PiTimeline.Infrastructure.Media
{
    public class MediaHandler : IMediaHandler
    {
        private readonly GalleryConfiguration _configuration;
        private readonly ILogger<MediaHandler> _logger;
        public MediaHandler(
            IOptions<GalleryConfiguration> options,
            ILogger<MediaHandler> logger)
        {
            _configuration = options.Value;
            _logger = logger;
        }

        public async Task CreateThumbnailAsync(
            string originPath, 
            string outputPath, 
            int resolutionFactor)
        {
            var mediaType = GetMediaType(originPath);
            if (mediaType == MediaType.Photo)
                await Task.Run(() => SavePhoto(originPath, outputPath, resolutionFactor));
            else
                await SaveVideoAsync(originPath, outputPath, resolutionFactor);
        }

        public MediaType GetMediaType(string path)
        {
            var extension = Path.GetExtension(path);
            return _configuration.PhotoExtensions.Contains(extension, StringComparison.InvariantCultureIgnoreCase) ? MediaType.Photo : MediaType.Video;
        }

        private static void SavePhoto(string inputPath, string outputPath, int resolutionFactor)
        {
            using var codec = SKCodec.Create(inputPath, out SKCodecResult result);
            if (codec == null)
                throw new ApplicationException($"Generate thumbnail for {inputPath} error: {result}");

            SaveImg(codec, outputPath, resolutionFactor);
        }

        private static async Task SaveVideoAsync(string inputPath, string outputPath, int resolutionFactor)
        {
            var bitmap = await FFMpeg.SnapshotAsync(inputPath);
            if (bitmap == null)
            {
                throw new ApplicationException($"Read {inputPath} error.");
            }

            var stream = new MemoryStream();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
            stream.Seek(0, SeekOrigin.Begin);

            using var codec = SKCodec.Create(stream, out SKCodecResult result);
            if (codec == null)
                throw new ApplicationException($"Generate thumbnail for {inputPath} error: {result}");

            SaveImg(codec, outputPath, resolutionFactor);
        }

        private static void SaveImg(SKCodec codec, string outputPath, int resolutionFactor)
        {
            using var originBitmap = SKBitmap.Decode(codec);
            if (originBitmap == null)
                return;

            using var bitmap = AutoOrient(originBitmap, codec.EncodedOrigin);
            var resizeFactor = bitmap.Width > resolutionFactor ? (float)resolutionFactor / bitmap.Width : 1f;
            using var toBitmap = new SKBitmap((int)Math.Round(bitmap.Width * resizeFactor), (int)Math.Round(bitmap.Height * resizeFactor), bitmap.ColorType, bitmap.AlphaType);

            bitmap.ScalePixels(toBitmap, SKFilterQuality.High);
            
            var image = SKImage.FromBitmap(toBitmap);
            var data = image.Encode(SKEncodedImageFormat.Jpeg, 100);
            var directory = Path.GetDirectoryName(outputPath);
            if (!System.IO.Directory.Exists(directory))
            {
                System.IO.Directory.CreateDirectory(directory);
            }
            using var stream = new FileStream(outputPath, FileMode.Create, FileAccess.Write);
            data.SaveTo(stream);
            return;
        }

        public MetadataDto GetMetadata(string path)
        {
            var mediaType = GetMediaType(path);
            IReadOnlyList<MetadataExtractor.Directory> directories;
            try
            {
                directories = ImageMetadataReader.ReadMetadata(path);
            }
            catch (ImageProcessingException ie)
            {
                _logger.LogError(ie, $"Image process error for {path}");
                return new MetadataDto();
            }

            var fileMetaDirectory = directories.OfType<FileMetadataDirectory>().FirstOrDefault();

            var meta = new MetadataDto
            {
                Size = new SizeDto(),
                FileSize = fileMetaDirectory?.GetInt64(FileMetadataDirectory.TagFileSize),
                CreationTime = fileMetaDirectory?.GetDateTime(FileMetadataDirectory.TagFileModifiedDate),
                Type = mediaType
            };

            var fileTypeDirectory = directories.OfType<FileTypeDirectory>().FirstOrDefault();
            var fileType = fileTypeDirectory?.GetString(FileTypeDirectory.TagDetectedFileTypeName)?.ToLower();

            switch (fileType)
            {
                case "mp4":
                case "quicktime":
                    var qtTrackHeaderDirectory = directories.OfType<QuickTimeTrackHeaderDirectory>().FirstOrDefault(qt => qt.GetInt32(QuickTimeTrackHeaderDirectory.TagWidth) > 0);
                    var rotation = qtTrackHeaderDirectory?.GetInt32(QuickTimeTrackHeaderDirectory.TagRotation);
                    var qtWidth = qtTrackHeaderDirectory?.GetInt32(QuickTimeTrackHeaderDirectory.TagWidth);
                    var qtHeight = qtTrackHeaderDirectory?.GetInt32(QuickTimeTrackHeaderDirectory.TagHeight);
                    meta.Size.Width = rotation == 0 ? qtWidth : qtHeight;
                    meta.Size.Height = rotation == 0 ? qtHeight : qtWidth;
                    break;
                case "jpeg":
                    var jpegDirectory = directories.OfType<JpegDirectory>().FirstOrDefault();
                    var tagWidth = jpegDirectory?.GetInt32(JpegDirectory.TagImageWidth);
                    var tagHeight = jpegDirectory?.GetInt32(JpegDirectory.TagImageHeight);

                    var ifd0Directory = directories.OfType<ExifIfd0Directory>().FirstOrDefault();
                    int orientation = -1;
                    if (ifd0Directory != null)
                    {
                        orientation = ifd0Directory.TryGetInt32(ExifDirectoryBase.TagOrientation, out int value) ? value : -1;
                    }

                    // Typically, you will only get flag 1, 8, 3, 6 for digital photos. Flag 2, 7, 4, 5 represent mirrored and rotated version of images.
                    if (orientation > 4)
                    {
                        // Need to ratate
                        meta.Size.Width = tagHeight;
                        meta.Size.Height = tagWidth;
                    }
                    else
                    {
                        // Normal
                        meta.Size.Width = tagWidth;
                        meta.Size.Height = tagHeight;
                    }

                    break;
            }

            return meta;
        }

        private static SKBitmap AutoOrient(SKBitmap bitmap, SKEncodedOrigin origin)
        {
            SKBitmap rotated;
            switch (origin)
            {
                case SKEncodedOrigin.BottomRight:
                    using (var surface = new SKCanvas(bitmap))
                    {
                        surface.RotateDegrees(180, bitmap.Width / 2, bitmap.Height / 2);
                        surface.DrawBitmap(bitmap.Copy(), 0, 0);
                    }
                    return bitmap;
                case SKEncodedOrigin.RightTop:
                    rotated = new SKBitmap(bitmap.Height, bitmap.Width);
                    using (var surface = new SKCanvas(rotated))
                    {
                        surface.Translate(rotated.Width, 0);
                        surface.RotateDegrees(90);
                        surface.DrawBitmap(bitmap, 0, 0);
                    }
                    return rotated;
                case SKEncodedOrigin.LeftBottom:
                    rotated = new SKBitmap(bitmap.Height, bitmap.Width);
                    using (var surface = new SKCanvas(rotated))
                    {
                        surface.Translate(0, rotated.Height);
                        surface.RotateDegrees(270);
                        surface.DrawBitmap(bitmap, 0, 0);
                    }
                    return rotated;
                default:
                    return bitmap;
            }
        }
    }
}
