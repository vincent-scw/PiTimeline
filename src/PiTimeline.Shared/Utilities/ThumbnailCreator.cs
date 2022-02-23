using SkiaSharp;

namespace PiTimeline.Shared.Utilities
{
    public static class ThumbnailCreator
    {
        private const int MaxHeight = 720;

        public static void CreateThumbnail(string imgPath, string outputPath)
        {
            using var bitmap = SKBitmap.Decode(imgPath);

            var resizeFactor = bitmap.Height > MaxHeight ? (float)MaxHeight / bitmap.Height : 1f;

            using var toBitmap = new SKBitmap((int)Math.Round(bitmap.Width * resizeFactor), (int)Math.Round(bitmap.Height * resizeFactor), bitmap.ColorType, bitmap.AlphaType);

            using var canvas = new SKCanvas(toBitmap);
            // Draw a bitmap rescaled
            canvas.SetMatrix(SKMatrix.CreateScale(resizeFactor, resizeFactor));
            canvas.DrawBitmap(bitmap, 0, 0);
            canvas.ResetMatrix();

            canvas.Flush();

            using var image = SKImage.FromBitmap(toBitmap);
            using var data = image.Encode(SKEncodedImageFormat.Jpeg, 90);

            using var stream = new FileStream(outputPath, FileMode.Create, FileAccess.Write);
            data.SaveTo(stream);
        }
    }
}
