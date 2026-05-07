namespace PCConfig.Api.DTOs;

public class BuildDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public decimal TotalPrice { get; set; }
    public List<BuildItemDto> Items { get; set; } = [];
}

public class BuildItemDto
{
    public string CategorySlug { get; set; } = string.Empty;
    public int ComponentId { get; set; }
    public string ComponentName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class CreateBuildRequest
{
    public string Name { get; set; } = "Моя сборка";
    public List<CreateBuildItemRequest> Items { get; set; } = [];
}

public class CreateBuildItemRequest
{
    public string CategorySlug { get; set; } = string.Empty;
    public int ComponentId { get; set; }
}
