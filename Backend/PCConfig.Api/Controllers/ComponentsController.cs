using Microsoft.AspNetCore.Mvc;
using PCConfig.Api.DTOs;
using PCConfig.Api.Filters;
using PCConfig.Api.Services;

namespace PCConfig.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComponentsController(IComponentService service) : ControllerBase
{
    [HttpGet]                          // Visitor — доступно всем
    public async Task<IActionResult> GetAll([FromQuery] ComponentFilterDto filter)
        => Ok(await service.GetAllAsync(filter));

    [HttpGet("{id:int}")]              // Visitor — доступно всем
    public async Task<IActionResult> GetById(int id)
    {
        var comp = await service.GetByIdAsync(id);
        return comp is null ? NotFound() : Ok(comp);
    }

    [HttpPost]                         // Admin only
    [AdminMod]
    public async Task<IActionResult> Create(CreateComponentRequest request)
    {
        var created = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]              // Admin only
    [AdminMod]
    public async Task<IActionResult> Update(int id, UpdateComponentRequest request)
    {
        var updated = await service.UpdateAsync(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]           // Admin only
    [AdminMod]
    public async Task<IActionResult> Delete(int id)
        => await service.DeleteAsync(id) ? NoContent() : NotFound();
}
