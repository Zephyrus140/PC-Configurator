using System.ComponentModel.DataAnnotations;

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
    [MaxLength(100)]
    public string Name { get; set; } = "Моя сборка";

    [Required, MinLength(1, ErrorMessage = "Добавьте хотя бы один компонент.")]
    public List<CreateBuildItemRequest> Items { get; set; } = [];
}

public class CreateBuildItemRequest
{
    [Required]
    public string CategorySlug { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Некорректный ID компонента.")]
    public int ComponentId { get; set; }
}
