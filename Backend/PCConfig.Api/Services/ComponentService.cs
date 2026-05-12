using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Data;
using PCConfig.Api.DTOs;
using PCConfig.Api.Models;
using System.Text.Json;

namespace PCConfig.Api.Services;

public class ComponentService(AppDbContext db) : IComponentService
{
    public async Task<IEnumerable<ComponentDto>> GetAllAsync(ComponentFilterDto filter)
    {
        var query = db.Components
            .Include(c => c.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Category))
            query = query.Where(c => c.Category.Slug == filter.Category);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var s = filter.Search.ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(s) || c.Brand.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(filter.Socket))
            query = query.Where(c => c.Socket == filter.Socket);

        if (!string.IsNullOrWhiteSpace(filter.FormFactor))
            query = query.Where(c => c.FormFactor == filter.FormFactor);

        if (!string.IsNullOrWhiteSpace(filter.RamType))
            query = query.Where(c => c.RamType == filter.RamType);

        if (!string.IsNullOrWhiteSpace(filter.ChipBrand))
            query = query.Where(c => c.ChipBrand == filter.ChipBrand);

        if (filter.MinPrice.HasValue)
            query = query.Where(c => c.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(c => c.Price <= filter.MaxPrice.Value);

        query = filter.SortBy switch
        {
            "price-asc"  => query.OrderBy(c => c.Price),
            "price-desc" => query.OrderByDescending(c => c.Price),
            _            => query.OrderBy(c => c.Brand).ThenBy(c => c.Name),
        };

        return (await query.ToListAsync()).Select(MapToDto);
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
        Image     = c.Image,
    };
}
