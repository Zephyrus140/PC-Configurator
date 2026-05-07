namespace PCConfig.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;       // "cpu", "gpu", ...
    public string Name { get; set; } = string.Empty;       // "Процессор", ...
    public string Icon { get; set; } = string.Empty;       // Bootstrap Icons class
    public int SortOrder { get; set; }

    public ICollection<Component> Components { get; set; } = [];
}
