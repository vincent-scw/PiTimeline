using System.IO;
using PiTimeline.Shared.Utilities;
using Xunit;

namespace PiTimeline.UnitTests.Shared
{
    public class ThumbnailCreatorTests
    {
        [Fact]
        public void CreateThumbnail_ShouldSucceed()
        {
            var input = "magnificent-picture.jpg";
            var output = "magnificent-picture-thumbnail.jpg";
            MediaUtilities.CreateThumbnail(input, output);

            Assert.True(File.Exists(output));
        }
    }
}