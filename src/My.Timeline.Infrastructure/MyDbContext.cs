﻿using Microsoft.EntityFrameworkCore;
using MyTimeline.Domain;

namespace MyTimeline.Infrastructure
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options)
            : base(options)
        {
        }

        public DbSet<Timeline> Timelines { get; set; }
        public DbSet<Moment> Moments { get; set; }
        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Timeline>(entity =>
            {
                entity.ToTable("Timelines");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Title).IsUnique();
                entity.Property(e => e.Title).HasMaxLength(256);
                entity.Property(e => e.IsCompleted);
                entity.Property(e => e.Since);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);
                entity.Property(e => e.CreatedDateTime).IsRequired();
            });
            modelBuilder.Entity<Moment>(entity =>
            {
                entity.ToTable("Moments");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.TimelineId);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.TakePlaceAtDateTime).IsRequired();
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);
                entity.Property(e => e.CreatedDateTime).IsRequired();
            });
            modelBuilder.Entity<Photo>(entity =>
            {
                entity.ToTable("Photos");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Description);
                entity.Property(e => e.Link);
                entity.Property(e => e.CreatedDateTime).IsRequired();
            });
            base.OnModelCreating(modelBuilder);
        }
    }
}
