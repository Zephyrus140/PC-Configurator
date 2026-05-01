namespace PCConfig.Api.DTOs;

public class ComponentDto
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public List<string> Specs { get; set; } = [];

    // Compatibility
    public string? Socket { get; set; }
    public string? FormFactor { get; set; }
    public int? Tdp { get; set; }
    public int? MaxTdp { get; set; }
    public int? Wattage { get; set; }
    public string? RamType { get; set; }
    public List<string>? SupportedFormFactors { get; set; }
    public string? ChipBrand { get; set; }
}
