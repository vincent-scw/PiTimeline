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

        public DbSet<Timeline> Timelines { get; set; }
        public DbSet<Photo> Photos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(BuildConnectionString());
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Timeline>(entity =>
            {
                entity.ToTable("Timelines");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Title).IsUnique();
                entity.Property(e => e.Title).HasMaxLength(256);
                entity.Property(e => e.IsCompleted);
                entity.Property(e => e.CreatedDateTime).IsRequired();
            });
            modelBuilder.Entity<Moment>(entity =>
            {
                entity.ToTable("Moments");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).HasMaxLength(2000);
                entity.Property(e => e.CreatedDateTime).IsRequired();
            });
            modelBuilder.Entity<Photo>(entity =>
            {
                entity.ToTable("Photos");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Description);
                entity.Property(e => e.Sequence);
                entity.Property(e => e.Link);
                entity.Property(e => e.CreatedDateTime).IsRequired();
            });
            base.OnModelCreating(modelBuilder);
        }

        private string BuildConnectionString()
        {
            return $"Data Source={_configuration.DataSource}";
        }
    }
}
