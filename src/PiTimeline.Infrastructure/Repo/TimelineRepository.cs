using PiTimeline.Domain;

namespace PiTimeline.Infrastructure.Repo
{
    public class TimelineRepository : CrudRepositoryBase<Timeline>, ITimelineRepository
    {
        public TimelineRepository(MyDbContext dbContext)
            : base(dbContext)
        {

        }
    }
}
