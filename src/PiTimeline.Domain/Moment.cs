using PiTimeline.Domain.Events;
using PiTimeline.Domain.SeedWork;
using PiTimeline.Shared.Utilities;
using System;

namespace PiTimeline.Domain
{
    public class Moment : Entity, IAggregateRoot // set moment as another aggregate root to make mutation easier.
    {
        protected Moment()
        {
        }

        public Moment(
            string timelineId, 
            string content, 
            DateTime takePlaceAt)
            : this()
        {
            Id = IdGen.Generate();
            CreatedDateTime = DateTime.Now;

            TimelineId = timelineId;
            Content = content;
            TakePlaceAtDateTime = takePlaceAt;

            AddDomainEvent(new MomentChangedEvent(this));
        }

        public string TimelineId { get; }

        public string Content { get; private set; }

        public DateTime TakePlaceAtDateTime { get; private set; }

        public void Update(string content, DateTime takePlaceAt)
        {
            Content = content;
            TakePlaceAtDateTime = takePlaceAt;

            UpdatedDateTime = DateTime.Now;

            AddDomainEvent(new MomentChangedEvent(this));
        }
    }
}
