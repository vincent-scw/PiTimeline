using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain.SeedWork;
using System.Threading.Tasks;

namespace MyTimeline.Infrastructure
{
    public abstract class CrudRepositoryBase<T> : IRepository<T> 
        where T : Entity, IAggregateRoot
    {
        protected MyDbContext DbContext { get; }

        protected CrudRepositoryBase(MyDbContext dbContext)
        {
            dbContext.Database.EnsureCreated();
            DbContext = dbContext;
        }

        public async Task<T> GetByIdAsync(string id)
        {
            var entity = await DbContext.Set<T>().FindAsync(id);
            if (entity == null)
                throw new DomainException(DefinedExceptions.NotFound);
            return entity;
        }

        public async Task<T> AddAsync(T entity)
        {
            var t = DbContext.Set<T>().Add(entity).Entity;
            await DbContext.SaveChangesAsync();
            return t;
        }

        public async Task UpdateAsync(T entity)
        {
            DbContext.Entry(entity).State = EntityState.Modified;
            await DbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(string id, bool hardDelete)
        {
            var entity = await GetByIdAsync(id);

            if (hardDelete)
                DbContext.Set<T>().Remove(entity);
            else
            {
                entity.SetDeleted(true);
                DbContext.Entry(entity).State = EntityState.Modified;
            }

            await DbContext.SaveChangesAsync();
        }
    }
}
