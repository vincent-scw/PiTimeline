using PiTimeline.Domain.SeedWork;
using PiTimeline.Shared.Utilities;
using System;

namespace PiTimeline.Domain
{
    public class Timeline : Entity, IAggregateRoot
    {
        protected Timeline()
        {
        }

        public Timeline(string title, string coverPatternUrl)
            : this()
        {
            Id = IdGen.Generate();
            CreatedDateTime = DateTime.Now;

            Title = title;
            CoverPatternUrl = coverPatternUrl;
        }

        public string Title { get; private set; }

        public DateTime Since { get; private set; }

        public string CoverPatternUrl { get; private set; }

        public void Update(string title, string coverPatternUrl)
        {
            UpdatedDateTime = DateTime.Now;

            Title = title;
            CoverPatternUrl = coverPatternUrl;
        }

        public void SetSince(DateTime newDate)
        {
            Since = newDate;
        }
    }
}
