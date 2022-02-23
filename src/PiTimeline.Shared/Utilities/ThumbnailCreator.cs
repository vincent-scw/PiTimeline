using SkiaSharp;

namespace PiTimeline.Shared.Utilities
{
    public static class ThumbnailCreator
    {
        public static string CreateThumbnail(string imgPath, int newHeight, int newWidth)
        {
            var resizeFactor = 0.5f;
            using var bitmap = SKBitmap.Decode(imgPath);

            using var toBitmap = new SKBitmap((int)Math.Round(bitmap.Width * resizeFactor), (int)Math.Round(bitmap.Height * resizeFactor), bitmap.ColorType, bitmap.AlphaType);

            using var canvas = new SKCanvas(toBitmap);
            // Draw a bitmap rescaled
            canvas.SetMatrix(SKMatrix.CreateScale(resizeFactor, resizeFactor));
            canvas.DrawBitmap(bitmap, 0, 0);
            canvas.ResetMatrix();

            using var font = SKTypeface.FromFamilyName("Arial");
            using var brush = new SKPaint
            {
                Typeface = font,
                TextSize = 64.0f,
                IsAntialias = true,
                Color = new SKColor(255, 255, 255, 255)
            };
            canvas.DrawText("Resized!", 0, bitmap.Height * resizeFactor / 2.0f, brush);

            canvas.Flush();

            using var image = SKImage.FromBitmap(toBitmap);
            using var data = image.Encode(SKEncodedImageFormat.Jpeg, 90);

            using (var stream = new FileStream("output.jpg", FileMode.Create, FileAccess.Write))
                data.SaveTo(stream);

            return "";
        }
    }
}
