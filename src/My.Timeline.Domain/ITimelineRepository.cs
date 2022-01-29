using MyTimeline.Domain.SeedWork;

namespace MyTimeline.Domain
{
    public interface ITimelineRepository : IRepository<Timeline>
    {
        Timeline Add(Timeline entity);
        void Update(Timeline entity);
        void Delete(Timeline entity);
    }
}
