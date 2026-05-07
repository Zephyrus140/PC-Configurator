using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PCConfig.Api.Data;

namespace PCConfig.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await db.Categories
            .OrderBy(c => c.SortOrder)
            .Select(c => new { c.Id, c.Slug, c.Name, c.Icon })
            .ToListAsync();

        return Ok(categories);
    }
}
