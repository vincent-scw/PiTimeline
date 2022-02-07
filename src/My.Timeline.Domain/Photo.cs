using MyTimeline.Domain.SeedWork;
using MyTimeline.Shared.Utilities;
using System;

namespace MyTimeline.Domain
{
    public class Photo : Entity
    {
        protected Photo() {}

        public Photo(string link, string description)
        {
            Id = IdGen.Generate();
            CreatedDateTime = DateTime.Now;

            Link = link;
            Description = description;
        }

        public string Description { get; private set; }
        public string Link { get; private set; }
        public string ThumbnailLink { get; private set; }
    }
}
