namespace PCConfig.Api.Models;

public class Component
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string SpecsJson { get; set; } = "[]";           // JSON string[]

    // Compatibility fields (nullable — only relevant for certain categories)
    public string? Socket { get; set; }                     // CPU / MB: "AM5" | "LGA1700"
    public string? FormFactor { get; set; }                 // MB: "ATX" | "mATX"
    public int? Tdp { get; set; }                           // CPU / GPU: TDP watts
    public int? MaxTdp { get; set; }                        // Cooler: max supported TDP
    public int? Wattage { get; set; }                       // PSU: rated watts
    public string? RamType { get; set; }                    // MB / RAM: "DDR5"
    public string? SupportedFormFactorsJson { get; set; }   // Case: JSON string[]
    public string? ChipBrand { get; set; }                   // GPU: "NVIDIA" | "AMD" | "Intel"

    public Category Category { get; set; } = null!;
    public ICollection<BuildItem> BuildItems { get; set; } = [];
}
