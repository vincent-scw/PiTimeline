using MediatR;

namespace PiTimeline.Domain.Events
{
    public class MomentChangedEvent : INotification
    {
        public Moment Moment { get; }

        public MomentChangedEvent(Moment moment)
        {
            Moment = moment;
        }
    }
}
