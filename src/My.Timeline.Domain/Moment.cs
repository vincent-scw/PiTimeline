using System;
using System.Collections.Generic;
using System.Linq;
using MyTimeline.Domain.SeedWork;
using MyTimeline.Shared.Utilities;

namespace MyTimeline.Domain
{
    public class Moment : Entity, IAggregateRoot
    {
        protected Moment()
        {
            _photos = new List<MomentPhoto>();
        }

        public Moment(
            string timelineId, 
            string content, 
            DateTime occurredAt,
            IEnumerable<MomentPhoto> photos)
            : this()
        {
            Id = IdGen.Generate();
            CreatedDateTime = DateTime.Now;

            TimelineId = timelineId;
            Content = content;
            OccurredAtDateTime = occurredAt;
            if (photos != null)
                _photos = photos.ToList();
        }

        public string TimelineId { get; }

        public string Content { get; }

        public DateTime OccurredAtDateTime { get; }

        private List<MomentPhoto> _photos;
        public IReadOnlyList<MomentPhoto> Photos => _photos;
    }
}
