namespace PCConfig.Api.Models;

public class BuildItem
{
    public int Id { get; set; }
    public int BuildId { get; set; }
    public int ComponentId { get; set; }
    public string CategorySlug { get; set; } = string.Empty;

    public Build Build { get; set; } = null!;
    public Component Component { get; set; } = null!;
}
