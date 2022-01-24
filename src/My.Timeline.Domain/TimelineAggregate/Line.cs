using System.Collections.Generic;

namespace My.Timeline.Domain.TimelineAggregate
{
    public class Line : EntityBase, IAggregateRoot
    {
        public Line()
        {

        }

        public string Title { get; }

        public bool IsCompleted { get; }

        private List<Moment> _moments;
        public IReadOnlyList<Moment> Moments => _moments;
    }
}
