using Academy.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Academy.Api.Data;

public class AcademyDbContext : DbContext
{
    public AcademyDbContext(DbContextOptions<AcademyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Lead>()
            .HasIndex(l => l.CreatedAt);

        modelBuilder.Entity<Lead>()
            .HasIndex(l => l.Phone);

        modelBuilder.Entity<Admin>()
            .HasIndex(a => a.Username)
            .IsUnique();

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(rt => rt.Token)
            .IsUnique();

        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.Admin)
            .WithMany(a => a.RefreshTokens)
            .HasForeignKey(rt => rt.AdminId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}