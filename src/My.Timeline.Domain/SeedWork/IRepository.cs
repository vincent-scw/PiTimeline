using System.Threading.Tasks;

namespace MyTimeline.Domain.SeedWork
{
    public interface IRepository<T> 
        where T: Entity, IAggregateRoot
    {
        Task<T> GetByIdAsync(string id);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(string id, bool hardDelete);
    }
}
