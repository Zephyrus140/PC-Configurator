using Microsoft.AspNetCore.Mvc;
using PCConfig.Api.DTOs;
using PCConfig.Api.Services;

namespace PCConfig.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComponentsController(IComponentService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ComponentFilterDto filter)
        => Ok(await service.GetAllAsync(filter));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var comp = await service.GetByIdAsync(id);
        return comp is null ? NotFound() : Ok(comp);
    }
}
