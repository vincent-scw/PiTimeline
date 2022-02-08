using MyTimeline.Domain.SeedWork;
using MyTimeline.Shared.Utilities;
using System;

namespace MyTimeline.Domain
{
    public class Timeline : Entity, IAggregateRoot
    {
        protected Timeline()
        {
        }

        public Timeline(string title, bool isCompleted)
            : this()
        {
            Id = IdGen.Generate();
            CreatedDateTime = DateTime.Now;

            Title = title;
            IsCompleted = isCompleted;
        }

        public string Title { get; private set; }

        public bool IsCompleted { get; private set; }

        public DateTime Since { get; private set; }

        public void Update(string title, bool isCompleted)
        {
            UpdatedDateTime = DateTime.Now;

            Title = title;
            IsCompleted = isCompleted;
        }
    }
}
