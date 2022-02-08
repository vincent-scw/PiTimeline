using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain;
using MyTimeline.Domain.SeedWork;
using System.Threading.Tasks;

namespace MyTimeline.Infrastructure
{
    public class TimelineRepository : CrudRepositoryBase<Timeline>, ITimelineRepository
    {
        public TimelineRepository(MyDbContext dbContext)
            : base(dbContext)
        {

        }
    }
}
