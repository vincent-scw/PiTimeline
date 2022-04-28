using FFMpegCore;
using Microsoft.Extensions.Options;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using SkiaSharp;

namespace PiTimeline.Shared.Utilities
{
    public enum MediaType
    {
        Photo,
        Video
    }

    public class MediaUtilities
    {
        private readonly GalleryConfiguration _configuration;
        public MediaUtilities(IOptions<GalleryConfiguration> options)
        {
            _configuration = options.Value;
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
            var resizeFactor = bitmap.Height > resolutionFactor ? (float)resolutionFactor / bitmap.Height : 1f;
            var toBitmap = new SKBitmap((int)Math.Round(bitmap.Width * resizeFactor), (int)Math.Round(bitmap.Height * resizeFactor), bitmap.ColorType, bitmap.AlphaType);
            var canvas = new SKCanvas(toBitmap);
            // Draw a bitmap rescaled
            canvas.SetMatrix(SKMatrix.CreateScale(resizeFactor, resizeFactor));
            canvas.DrawBitmap(bitmap, 0, 0);
            canvas.ResetMatrix();

            canvas.Flush();
            var image = SKImage.FromBitmap(toBitmap);
            var data = image.Encode(SKEncodedImageFormat.Jpeg, 90);
            var directory = Path.GetDirectoryName(outputPath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            using var stream = new FileStream(outputPath, FileMode.Create, FileAccess.Write);
            data.SaveTo(stream);
            return;
        }

        public MetadataDto GetMetadata(string path)
        {
            var mediaType = GetMediaType(path);
            if (mediaType == MediaType.Photo)
                return GetPhotoMetadata(path);
            else
                return GetVideoMetadata(path);
        }

        private static MetadataDto GetVideoMetadata(string path)
        {
            var fi = new FileInfo(path);
            return new MetadataDto 
            {
                FileSize = fi.Length,
                CreationTime = fi.CreationTime,
                Type = MediaType.Video
            };
        }

        private static MetadataDto GetPhotoMetadata(string path)
        {
            var fi = new FileInfo(path);
            using var codec = SKCodec.Create(path);
            using var originBitmap = SKBitmap.Decode(codec);
            using var bitmap = AutoOrient(originBitmap, codec.EncodedOrigin);
            return new MetadataDto
            {
                Size = new SizeDto { Width = bitmap.Width, Height = bitmap.Height },
                FileSize = fi.Length,
                CreationTime = fi.CreationTime,
                Type = MediaType.Photo
            };
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
