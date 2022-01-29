using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyTimeline.Domain;
using MyTimeline.Domain.SeedWork;

namespace MyTimeline.Infrastructure
{
    public class MyDbContext : DbContext, IUnitOfWork
    {
        private readonly DbConfiguration _configuration;
        public MyDbContext(IOptions<DbConfiguration> options)
        {
            _configuration = options.Value;
        }

        public DbSet<Timeline> Timelines { get; set; }
        public DbSet<Moment> Moments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(BuildConnectionString());
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Timeline>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Title).IsUnique();
                entity.Property(e => e.Title).HasMaxLength(256);
                entity.Property(e => e.IsCompleted);
            });
            modelBuilder.Entity<Moment>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
            base.OnModelCreating(modelBuilder);
        }

        private string BuildConnectionString()
        {
            return $"Data Source={_configuration.DataSource}";
        }

        public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            // TODO: handle domain events
            var result = await base.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
