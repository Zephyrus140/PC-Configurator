namespace PCConfig.Api.Models;

public class Build
{
    public int Id { get; set; }
    public string Name { get; set; } = "Без названия";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal TotalPrice { get; set; }

    public ICollection<BuildItem> Items { get; set; } = [];
}
