using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyTimeline.Domain;

namespace MyTimeline.Infrastructure
{
    public class MyDbContext : DbContext
    {
        private readonly DbConfiguration _configuration;
        public MyDbContext(IOptions<DbConfiguration> options)
        {
            _configuration = options.Value;
        }

        public DbSet<Timeline> Lines { get; set; }

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
            base.OnModelCreating(modelBuilder);
        }

        private string BuildConnectionString()
        {
            return $"Data Source={_configuration.DataSource}";
        }
    }
}
