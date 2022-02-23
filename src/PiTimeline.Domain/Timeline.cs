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

        public Timeline(string title)
            : this()
        {
            Id = IdGen.Generate();
            CreatedDateTime = DateTime.Now;

            Title = title;
        }

        public string Title { get; private set; }

        public DateTime Since { get; private set; }

        public void Update(string title)
        {
            UpdatedDateTime = DateTime.Now;

            Title = title;
        }
    }
}
