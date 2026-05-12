using Microsoft.AspNetCore.Mvc;
using PCConfig.Api.Services;

namespace PCConfig.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComponentsController(IComponentService service) : ControllerBase
{
    /// <summary>Returns all components, optionally filtered by category slug (e.g. "cpu", "gpu").</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
        => Ok(await service.GetAllAsync(category));

    /// <summary>Returns a single component by ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var comp = await service.GetByIdAsync(id);
        return comp is null ? NotFound() : Ok(comp);
    }
}
