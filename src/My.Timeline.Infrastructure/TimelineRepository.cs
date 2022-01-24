using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using My.Timeline.Domain.TimelineAggregate;

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

        public Task<List<Line>> FetchLinesAsync()
        {
            return _dbContext.Lines.ToListAsync();
        }
    }
}
