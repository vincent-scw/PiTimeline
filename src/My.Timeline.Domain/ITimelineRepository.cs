using System.Threading.Tasks;
using MyTimeline.Domain.SeedWork;

namespace MyTimeline.Domain
{
    public interface ITimelineRepository : IRepository<Timeline>
    {
        Task<Timeline> GetByIdAsync(string id);
        Task<Timeline> AddAsync(Timeline entity);
        Task UpdateAsync(Timeline entity);
        Task DeleteAsync(string id);
    }
}
