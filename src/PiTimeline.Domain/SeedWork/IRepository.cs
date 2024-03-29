﻿using System.Threading.Tasks;

namespace PiTimeline.Domain.SeedWork
{
    public interface IRepository<T> 
        where T: Entity, IAggregateRoot
    {
        Task<T> GetByIdAsync(string id);
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task DeleteAsync(string id, bool hardDelete);
    }
}
