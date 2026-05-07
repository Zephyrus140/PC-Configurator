using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Data;
using PCConfig.Api.DTOs;
using PCConfig.Api.Models;
using System.Text.Json;

namespace PCConfig.Api.Services;

public class ComponentService(AppDbContext db) : IComponentService
{
    public async Task<IEnumerable<ComponentDto>> GetAllAsync(string? categorySlug = null)
    {
        var query = db.Components
            .Include(c => c.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(categorySlug))
            query = query.Where(c => c.Category.Slug == categorySlug);

        var list = await query
            .OrderBy(c => c.Brand)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return list.Select(MapToDto);
    }

    public async Task<ComponentDto?> GetByIdAsync(int id)
    {
        var comp = await db.Components
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.Id == id);

        return comp is null ? null : MapToDto(comp);
    }

    private static ComponentDto MapToDto(Component c) => new()
    {
        Id     = c.Id,
        Brand  = c.Brand,
        Name   = c.Name,
        Price  = c.Price,
        Specs  = JsonSerializer.Deserialize<List<string>>(c.SpecsJson) ?? [],
        Socket              = c.Socket,
        FormFactor          = c.FormFactor,
        Tdp                 = c.Tdp,
        MaxTdp              = c.MaxTdp,
        Wattage             = c.Wattage,
        RamType             = c.RamType,
        SupportedFormFactors = c.SupportedFormFactorsJson is not null
            ? JsonSerializer.Deserialize<List<string>>(c.SupportedFormFactorsJson)
            : null,
        ChipBrand = c.ChipBrand,
    };
}
