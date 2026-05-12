using Microsoft.AspNetCore.Mvc;
using PCConfig.Api.DTOs;
using PCConfig.Api.Services;

namespace PCConfig.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BuildsController(IBuildService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var build = await service.GetByIdAsync(id);
        return build is null ? NotFound() : Ok(build);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBuildRequest request)
    {
        var build = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = build.Id }, build);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => await service.DeleteAsync(id) ? NoContent() : NotFound();
}
