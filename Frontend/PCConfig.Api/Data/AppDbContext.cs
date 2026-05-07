using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Models;

namespace PCConfig.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Category>  Categories => Set<Category>();
    public DbSet<Component> Components => Set<Component>();
    public DbSet<Build>     Builds     => Set<Build>();
    public DbSet<BuildItem> BuildItems => Set<BuildItem>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Component>(e =>
        {
            e.Property(c => c.Price).HasColumnType("decimal(18,2)");
        });

        mb.Entity<Build>(e =>
        {
            e.Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");
        });

        mb.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();
    }
}
