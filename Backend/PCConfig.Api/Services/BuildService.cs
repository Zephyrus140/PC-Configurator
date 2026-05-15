using AutoMapper;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Data;
using PCConfig.Api.DTOs;
using PCConfig.Api.Models;

namespace PCConfig.Api.Services;

public class BuildService(AppDbContext db, IMapper mapper) : IBuildService
{
    public async Task<IEnumerable<BuildDto>> GetAllAsync()
    {
        var builds = await db.Builds
            .Include(b => b.Items).ThenInclude(i => i.Component)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return mapper.Map<IEnumerable<BuildDto>>(builds);
    }

    public async Task<BuildDto?> GetByIdAsync(int id)
    {
        var build = await db.Builds
            .Include(b => b.Items).ThenInclude(i => i.Component)
            .FirstOrDefaultAsync(b => b.Id == id);

        return build is null ? null : mapper.Map<BuildDto>(build);
    }

    public async Task<BuildDto> CreateAsync(CreateBuildRequest request)
    {
        var componentIds = request.Items.Select(i => i.ComponentId).ToList();
        var componentMap = await db.Components
            .Where(c => componentIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id);

        var missing = componentIds.Except(componentMap.Keys).ToList();
        if (missing.Count > 0)
            throw new ValidationException($"Компоненты не найдены: {string.Join(", ", missing)}");

        var duplicates = request.Items
            .Where(i => i.CategorySlug != "ram")
            .GroupBy(i => i.CategorySlug)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        if (duplicates.Count > 0)
            throw new ValidationException($"Дублирующиеся категории: {string.Join(", ", duplicates)}");

        var build = new Build
        {
            Name  = request.Name,
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

    public async Task<BuildDto?> UpdateAsync(int id, UpdateBuildRequest request)
    {
        var build = await db.Builds.FindAsync(id);
        if (build is null) return null;

        build.Name = request.Name;
        await db.SaveChangesAsync();

        return (await GetByIdAsync(id))!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var build = await db.Builds.FindAsync(id);
        if (build is null) return false;
        db.Builds.Remove(build);
        await db.SaveChangesAsync();
        return true;
    }
}
