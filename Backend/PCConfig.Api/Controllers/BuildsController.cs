using Microsoft.AspNetCore.Mvc;
using PCConfig.Api.DTOs;
using PCConfig.Api.Filters;
using PCConfig.Api.Services;

namespace PCConfig.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BuildsController(IBuildService service) : ControllerBase
{
    [HttpGet]                          // Visitor — доступно всем
    public async Task<IActionResult> GetAll()
        => Ok(await service.GetAllAsync());

    [HttpGet("{id:int}")]              // Visitor — доступно всем
    public async Task<IActionResult> GetById(int id)
    {
        var build = await service.GetByIdAsync(id);
        return build is null ? NotFound() : Ok(build);
    }

    [HttpPost]                         // User + Admin
    [UserOnly]
    public async Task<IActionResult> Create(CreateBuildRequest request)
    {
        var build = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = build.Id }, build);
    }

    [HttpPut("{id:int}")]              // User + Admin
    [UserOnly]
    public async Task<IActionResult> Update(int id, UpdateBuildRequest request)
    {
        var updated = await service.UpdateAsync(id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]           // User + Admin
    [UserOnly]
    public async Task<IActionResult> Delete(int id)
        => await service.DeleteAsync(id) ? NoContent() : NotFound();
}
