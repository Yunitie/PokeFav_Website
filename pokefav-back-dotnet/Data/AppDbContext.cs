using Microsoft.EntityFrameworkCore;
using PokeFav.Api.Models;

namespace PokeFav.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet = collections pour accéder aux tables (équivalent de prisma.user, prisma.pokemon, etc.)
    public DbSet<User> Users { get; set; }
    public DbSet<Pokemon> Pokemons { get; set; }
    public DbSet<PokemonStats> PokemonStats { get; set; }
    public DbSet<PokemonRank> PokemonRanks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuration User
        modelBuilder.Entity<User>(entity =>
        {
            // Table "User" (singulier) pour coller à la BDD existante
            entity.ToTable("User");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.Property(e => e.PublicId).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configuration Pokemon
        modelBuilder.Entity<Pokemon>(entity =>
        {
            entity.ToTable("Pokemon");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.StatsId).IsUnique();
            entity.HasOne(e => e.Stats)
                  .WithOne(s => s.Pokemon)
                  .HasForeignKey<Pokemon>(e => e.StatsId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuration PokemonStats
        modelBuilder.Entity<PokemonStats>(entity =>
        {
            entity.ToTable("PokemonStats");
            entity.HasKey(e => e.Id);
        });

        // Configuration PokemonRank (table de liaison many-to-many)
        modelBuilder.Entity<PokemonRank>(entity =>
        {
            entity.ToTable("PokemonRank");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.PokemonId }).IsUnique(); // Contrainte unique sur (userId, pokemonId)
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.Score });

            // Relation avec User
            entity.HasOne(e => e.User)
                  .WithMany(u => u.PokemonRanks)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Relation avec Pokemon
            entity.HasOne(e => e.Pokemon)
                  .WithMany(p => p.PokemonRanks)
                  .HasForeignKey(e => e.PokemonId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}

