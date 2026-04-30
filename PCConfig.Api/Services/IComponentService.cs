using PCConfig.Api.DTOs;

namespace PCConfig.Api.Services;

public interface IComponentService
{
    Task<IEnumerable<ComponentDto>> GetAllAsync(string? categorySlug = null);
    Task<ComponentDto?> GetByIdAsync(int id);
}
