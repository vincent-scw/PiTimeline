using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain;
using MyTimeline.Domain.SeedWork;

namespace MyTimeline.Infrastructure
{
    public class MomentRepository : CrudRepositoryBase<Moment>, IMomentRepository
    {
        public MomentRepository(MyDbContext dbContext)
            : base(dbContext)
        {

        }
    }
}
