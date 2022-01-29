using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain;
using System.Threading.Tasks;

namespace MyTimeline.Infrastructure
{
    public class TimelineRepository : ITimelineRepository
    {
        private readonly MyDbContext _dbContext;
        public TimelineRepository(MyDbContext dbContext)
        {
            dbContext.Database.EnsureCreated();
            _dbContext = dbContext;
        }

        public async Task<Timeline> GetByIdAsync(string id)
        {
            var t = await _dbContext.Timelines.FindAsync(id);
            return t;
        }
        
        public async Task<Timeline> AddAsync(Timeline entity)
        {
            var t = _dbContext.Timelines.Add(entity).Entity;
            await _dbContext.SaveChangesAsync();
            return t;
        }

        public async Task UpdateAsync(Timeline entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(string id)
        {
            var entity = await _dbContext.Timelines.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return;

            _dbContext.Timelines.Remove(entity);
            await _dbContext.SaveChangesAsync();
        }
    }
}
