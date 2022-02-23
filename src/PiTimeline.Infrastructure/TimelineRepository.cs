using Microsoft.EntityFrameworkCore;
using PiTimeline.Domain;
using PiTimeline.Domain.SeedWork;
using System.Threading.Tasks;

namespace PiTimeline.Infrastructure
{
    public class TimelineRepository : CrudRepositoryBase<Timeline>, ITimelineRepository
    {
        public TimelineRepository(MyDbContext dbContext)
            : base(dbContext)
        {

        }
    }
}
