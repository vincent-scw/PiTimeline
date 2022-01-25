using System;
using MyTimeline.Domain.SeedWork;
using MyTimeline.Utilities;

namespace MyTimeline.Domain
{
    public class Photo : Entity
    {
        protected Photo() {}

        public Photo(string link, string description, int sequence)
        {
            Id = IdGen.Generate();
            CreatedDateTimeUtc = DateTimeOffset.UtcNow;

            Link = link;
            Description = description;
            Sequence = sequence;
        }

        public string Description { get; private set; }
        public string Link { get; private set; }
        public int Sequence { get; private set; }
    }
}
