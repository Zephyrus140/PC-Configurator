using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Data;
using PCConfig.Api.DTOs;
using PCConfig.Api.Models;

namespace PCConfig.Api.Services;

public class BuildService(AppDbContext db) : IBuildService
{
    public async Task<IEnumerable<BuildDto>> GetAllAsync()
    {
        var builds = await db.Builds
            .Include(b => b.Items).ThenInclude(i => i.Component)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return builds.Select(MapToDto);
    }

    public async Task<BuildDto?> GetByIdAsync(int id)
    {
        var build = await db.Builds
            .Include(b => b.Items).ThenInclude(i => i.Component)
            .FirstOrDefaultAsync(b => b.Id == id);

        return build is null ? null : MapToDto(build);
    }

    public async Task<BuildDto> CreateAsync(CreateBuildRequest request)
    {
        var componentIds = request.Items.Select(i => i.ComponentId).ToList();
        var componentMap = await db.Components
            .Where(c => componentIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id);

        var build = new Build
        {
            Name = request.Name,
            Items = request.Items.Select(i => new BuildItem
            {
                ComponentId  = i.ComponentId,
                CategorySlug = i.CategorySlug,
            }).ToList(),
        };

        build.TotalPrice = build.Items.Sum(i =>
            componentMap.TryGetValue(i.ComponentId, out var c) ? c.Price : 0m);

        db.Builds.Add(build);
        await db.SaveChangesAsync();

        return (await GetByIdAsync(build.Id))!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var build = await db.Builds.FindAsync(id);
        if (build is null) return false;
        db.Builds.Remove(build);
        await db.SaveChangesAsync();
        return true;
    }

    private static BuildDto MapToDto(Build b) => new()
    {
        Id         = b.Id,
        Name       = b.Name,
        CreatedAt  = b.CreatedAt,
        TotalPrice = b.TotalPrice,
        Items = b.Items.Select(i => new BuildItemDto
        {
            CategorySlug  = i.CategorySlug,
            ComponentId   = i.ComponentId,
            ComponentName = $"{i.Component.Brand} {i.Component.Name}",
            Price         = i.Component.Price,
        }).ToList(),
    };
}
