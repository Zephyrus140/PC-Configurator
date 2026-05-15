using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Data;
using PCConfig.Api.DTOs;
using PCConfig.Api.Models;
using System.Text.Json;

namespace PCConfig.Api.Services;

public class ComponentService(AppDbContext db, IMapper mapper) : IComponentService
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

        return mapper.Map<IEnumerable<ComponentDto>>(await query.ToListAsync());
    }

    public async Task<ComponentDto?> GetByIdAsync(int id)
    {
        var comp = await db.Components
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.Id == id);

        return comp is null ? null : mapper.Map<ComponentDto>(comp);
    }

    public async Task<ComponentDto> CreateAsync(CreateComponentRequest request)
    {
        var category = await db.Categories.FirstOrDefaultAsync(c => c.Slug == request.CategorySlug)
            ?? throw new KeyNotFoundException($"Категория '{request.CategorySlug}' не найдена.");

        var component = new Component
        {
            CategoryId               = category.Id,
            Brand                    = request.Brand,
            Name                     = request.Name,
            Price                    = request.Price,
            SpecsJson                = JsonSerializer.Serialize(request.Specs),
            Socket                   = request.Socket,
            FormFactor               = request.FormFactor,
            Tdp                      = request.Tdp,
            MaxTdp                   = request.MaxTdp,
            Wattage                  = request.Wattage,
            RamType                  = request.RamType,
            SupportedFormFactorsJson = request.SupportedFormFactors is not null
                                        ? JsonSerializer.Serialize(request.SupportedFormFactors)
                                        : null,
            ChipBrand                = request.ChipBrand,
            Chipset                  = request.Chipset,
            RamSlots                 = request.RamSlots,
            Image                    = request.Image,
        };

        db.Components.Add(component);
        await db.SaveChangesAsync();

        return (await GetByIdAsync(component.Id))!;
    }

    public async Task<ComponentDto?> UpdateAsync(int id, UpdateComponentRequest request)
    {
        var component = await db.Components.FindAsync(id);
        if (component is null) return null;

        component.Brand                    = request.Brand;
        component.Name                     = request.Name;
        component.Price                    = request.Price;
        component.SpecsJson                = JsonSerializer.Serialize(request.Specs);
        component.Socket                   = request.Socket;
        component.FormFactor               = request.FormFactor;
        component.Tdp                      = request.Tdp;
        component.MaxTdp                   = request.MaxTdp;
        component.Wattage                  = request.Wattage;
        component.RamType                  = request.RamType;
        component.SupportedFormFactorsJson = request.SupportedFormFactors is not null
                                             ? JsonSerializer.Serialize(request.SupportedFormFactors)
                                             : null;
        component.ChipBrand                = request.ChipBrand;
        component.Chipset                  = request.Chipset;
        component.RamSlots                 = request.RamSlots;
        component.Image                    = request.Image;

        await db.SaveChangesAsync();

        return (await GetByIdAsync(id))!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var component = await db.Components.FindAsync(id);
        if (component is null) return false;
        db.Components.Remove(component);
        await db.SaveChangesAsync();
        return true;
    }
}
