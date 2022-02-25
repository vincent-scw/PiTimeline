using PiTimeline.Domain;

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
