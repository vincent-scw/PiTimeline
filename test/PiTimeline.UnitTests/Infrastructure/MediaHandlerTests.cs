using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NSubstitute;
using PiTimeline.Infrastructure.Media;
using PiTimeline.Shared.Configuration;
using Xunit;

namespace PiTimeline.UnitTests.Infrastructure
{
    public class MediaHandlerTests
    {
        private MediaHandler _handler;
        private readonly IOptions<GalleryConfiguration> _config;
        private readonly ILogger<MediaHandler> _logger;

        private const string PicturePath = "magnificent-picture.jpg";

        public MediaHandlerTests()
        {
            _config = Substitute.For<IOptions<GalleryConfiguration>>();
            _logger = Substitute.For<ILogger<MediaHandler>>();

            _config.Value.Returns(new GalleryConfiguration()
            {
                PhotoExtensions = ".jpg"
            });

            _handler = new MediaHandler(_config, _logger);
        }

        [Fact]
        public void GetMeta_ShouldAsExpected()
        {
            var meta = _handler.GetMetadata(PicturePath);

            Assert.NotNull(meta?.Size);
            Assert.Equal(1920, meta?.Size?.Width);
            Assert.Equal(1200, meta?.Size?.Height);
        }
    }
}
