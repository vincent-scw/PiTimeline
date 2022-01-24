using System;

namespace My.Timeline.Infrastructure
{
    public class TimelineRepository
    {
        private readonly MyDbContext _dbContext;
        public TimelineRepository(MyDbContext dbContext)
        {
            dbContext.Database.EnsureCreated();
            _dbContext = dbContext;
        }
    }
}
