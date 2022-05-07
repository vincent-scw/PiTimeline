using MediatR;
using PiTimeline.Domain;
using PiTimeline.Domain.Events;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PiTimeline.DomainEventHandlers
{
    public class UpdateTimelineSinceWhenMomentChangedHandler : INotificationHandler<MomentChangedEvent>
    {
        private ITimelineRepository _timelineRepository;
        private IMomentRepository _momentRepository;
        public UpdateTimelineSinceWhenMomentChangedHandler(
            ITimelineRepository timelineRepository,
            IMomentRepository momentRepository)
        {
            _timelineRepository = timelineRepository;
            _momentRepository = momentRepository;
        }

        public async Task Handle(MomentChangedEvent e, CancellationToken cancellationToken)
        {
            var timeline = await _timelineRepository.GetByIdAsync(e.Moment.TimelineId);
            var moments = await _momentRepository.GetMomentsByTimelineAsync(e.Moment.TimelineId);
            var since = moments == null || moments.Count == 0 ? DateTime.MaxValue : moments.Min(x => x.TakePlaceAtDateTime);
            timeline.SetSince(since > e.Moment.TakePlaceAtDateTime ? e.Moment.TakePlaceAtDateTime : since);
            await _timelineRepository.UpdateAsync(timeline);
        }
    }
}
