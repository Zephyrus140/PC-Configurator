using PCConfig.Api.DTOs;

namespace PCConfig.Api.Services;

public interface IBuildService
{
    Task<IEnumerable<BuildDto>> GetAllAsync();
    Task<BuildDto?> GetByIdAsync(int id);
    Task<BuildDto> CreateAsync(CreateBuildRequest request);
    Task<bool> DeleteAsync(int id);
}
