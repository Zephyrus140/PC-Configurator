using PCConfig.Api.DTOs;

namespace PCConfig.Api.Services;

public interface IComponentService
{
    Task<IEnumerable<ComponentDto>> GetAllAsync(ComponentFilterDto filter);
    Task<ComponentDto?> GetByIdAsync(int id);
    Task<ComponentDto> CreateAsync(CreateComponentRequest request);
    Task<ComponentDto?> UpdateAsync(int id, UpdateComponentRequest request);
    Task<bool> DeleteAsync(int id);
}
