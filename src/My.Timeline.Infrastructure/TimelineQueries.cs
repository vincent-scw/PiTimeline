using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyTimeline.Infrastructure
{
    public class TimelineQueries
    {
        private readonly MyDbContext _dbContext;

        public TimelineQueries(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<List<Timeline>> FetchLinesAsync()
        {
            return _dbContext.Timelines.ToListAsync();
        }

        public Task<Timeline> GetLineAsync(string id)
        {
            return _dbContext.Timelines.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
