using System.ComponentModel.DataAnnotations;

namespace PCConfig.Api.DTOs;

public class CreateComponentRequest
{
    [Required] public string CategorySlug { get; set; } = string.Empty;
    [Required] public string Brand { get; set; } = string.Empty;
    [Required] public string Name { get; set; } = string.Empty;
    [Range(0, double.MaxValue)] public decimal Price { get; set; }
    public List<string> Specs { get; set; } = [];
    public string? Socket { get; set; }
    public string? FormFactor { get; set; }
    public int? Tdp { get; set; }
    public int? MaxTdp { get; set; }
    public int? Wattage { get; set; }
    public string? RamType { get; set; }
    public List<string>? SupportedFormFactors { get; set; }
    public string? ChipBrand { get; set; }
    public string? Chipset { get; set; }
    public int? RamSlots { get; set; }
    public string? Image { get; set; }
}

public class UpdateComponentRequest
{
    [Required] public string Brand { get; set; } = string.Empty;
    [Required] public string Name { get; set; } = string.Empty;
    [Range(0, double.MaxValue)] public decimal Price { get; set; }
    public List<string> Specs { get; set; } = [];
    public string? Socket { get; set; }
    public string? FormFactor { get; set; }
    public int? Tdp { get; set; }
    public int? MaxTdp { get; set; }
    public int? Wattage { get; set; }
    public string? RamType { get; set; }
    public List<string>? SupportedFormFactors { get; set; }
    public string? ChipBrand { get; set; }
    public string? Chipset { get; set; }
    public int? RamSlots { get; set; }
    public string? Image { get; set; }
}
