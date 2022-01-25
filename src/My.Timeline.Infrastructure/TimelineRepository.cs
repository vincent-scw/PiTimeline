using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain;

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
    }
}
