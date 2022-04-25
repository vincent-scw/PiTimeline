using FFMpegCore;
using SkiaSharp;

namespace PiTimeline.Shared.Utilities
{
    public static class ThumbnailUtility
    {
        private const int MaxHeight = 600;

        public static async Task CreateThumbnailAsync(string imgPath, string outputPath)
        {
            var originFile = new FileInfo(imgPath);

            if (!originFile.Exists)
                throw new FileNotFoundException(imgPath);

            var destFile = new FileInfo(outputPath);
            if (destFile.Exists && originFile.LastWriteTime <= destFile.LastWriteTime)
            {
                // Already created
                return;
            }

            using var codec = SKCodec.Create(imgPath, out SKCodecResult result);
            if (codec == null)
            {
                // TODO: It might be a video, FF configuration not ready
                if (await FFMpeg.SnapshotAsync(imgPath, outputPath))
                    return;

                throw new ApplicationException($"Read {imgPath} error: {result}");
            }

            await Task.Run(() => SaveImg(outputPath, codec));
        }

        private static void SaveImg(string outputPath, SKCodec codec)
        {
            using var originBitmap = SKBitmap.Decode(codec);
            if (originBitmap == null)
                return;

            var bitmap = AutoOrient(originBitmap, codec.EncodedOrigin);
            var resizeFactor = bitmap.Height > MaxHeight ? (float)MaxHeight / bitmap.Height : 1f;
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
