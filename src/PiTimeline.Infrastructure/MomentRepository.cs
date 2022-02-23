using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PiTimeline.Domain;
using PiTimeline.Domain.SeedWork;

namespace PiTimeline.Infrastructure
{
    public class MomentRepository : CrudRepositoryBase<Moment>, IMomentRepository
    {
        public MomentRepository(MyDbContext dbContext)
            : base(dbContext)
        {

        }
    }
}
