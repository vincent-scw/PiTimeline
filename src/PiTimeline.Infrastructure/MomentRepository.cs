using Microsoft.EntityFrameworkCore;
using PiTimeline.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PiTimeline.Infrastructure
{
    public class MomentRepository : CrudRepositoryBase<Moment>, IMomentRepository
    {
        public MomentRepository(MyDbContext dbContext)
            : base(dbContext)
        {

        }

        public Task<List<Moment>> GetMomentsByTimelineAsync(string timelineId)
        {
            return DbContext.Moments.Where(x => !x.IsDeleted && x.TimelineId == timelineId).ToListAsync();
        }
    }
}
