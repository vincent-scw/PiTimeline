using System;
using System.Collections.Generic;
using MyTimeline.Domain.SeedWork;
using MyTimeline.Shared.Utilities;

namespace MyTimeline.Domain
{
    public class Timeline : Entity, IAggregateRoot
    {
        protected Timeline()
        {
            _moments = new List<Moment>();
        }

        public Timeline(string title, bool isCompleted)
            : this()
        {
            Id = IdGen.Generate();
            CreatedDateTimeUtc = DateTimeOffset.UtcNow;

            Title = title;
            IsCompleted = isCompleted;
        }

        public string Title { get; }

        public bool IsCompleted { get; }

        private List<Moment> _moments;
        public IReadOnlyList<Moment> Moments => _moments;
    }
}
