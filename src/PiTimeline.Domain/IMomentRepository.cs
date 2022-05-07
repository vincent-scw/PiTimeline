using PiTimeline.Domain.SeedWork;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PiTimeline.Domain
{
    public interface IMomentRepository : IRepository<Moment>
    {
        Task<List<Moment>> GetMomentsByTimelineAsync(string timelineId);
    }
}
