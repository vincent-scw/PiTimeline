using MediatR;
using PiTimeline.Domain;
using PiTimeline.Domain.Events;
using System.Threading;
using System.Threading.Tasks;

namespace PiTimeline.DomainEventHandlers
{
    public class UpdateTimelineSinceWhenMomentChangedHandler : INotificationHandler<MomentChangedEvent>
    {
        private ITimelineRepository _timelineRepository;
        public UpdateTimelineSinceWhenMomentChangedHandler(ITimelineRepository timelineRepository)
        {
            _timelineRepository = timelineRepository;
        }

        public async Task Handle(MomentChangedEvent e, CancellationToken cancellationToken)
        {
            var timeline = await _timelineRepository.GetByIdAsync(e.Moment.TimelineId);
            if (timeline.CalculateSince(e.Moment.TakePlaceAtDateTime))
                await _timelineRepository.UpdateAsync(timeline);
        }
    }
}
