using PCConfig.Api.DTOs;

namespace PCConfig.Api.Services;

public interface IComponentService
{
    Task<IEnumerable<ComponentDto>> GetAllAsync(ComponentFilterDto filter);
    Task<ComponentDto?> GetByIdAsync(int id);
}
