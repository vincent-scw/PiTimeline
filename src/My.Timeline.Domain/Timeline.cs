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
            CreatedDateTime = DateTime.Now;

            Title = title;
            IsCompleted = isCompleted;
        }

        public string Title { get; private set; }

        public bool IsCompleted { get; private set; }

        public DateTime Since { get; private set; }

        private List<Moment> _moments;
        public IReadOnlyList<Moment> Moments => _moments;

        public void Update(string title, bool isCompleted)
        {
            UpdatedDateTime = DateTime.Now;

            Title = title;
            IsCompleted = isCompleted;
        }
    }
}
