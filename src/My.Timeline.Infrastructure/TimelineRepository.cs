using System.Linq;
using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain;
using MyTimeline.Domain.SeedWork;

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

        public IUnitOfWork UnitOfWork => _dbContext;

        public Timeline Add(Timeline entity)
        {
            return _dbContext.Timelines.Add(entity).Entity;
        }

        public void Update(Timeline entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(string id)
        {
            var entity = _dbContext.Timelines.FirstOrDefault(x => x.Id == id);
            if (entity != null)
                _dbContext.Timelines.Remove(entity);
        }
    }
}
