namespace PCConfig.Api.DTOs;

public class ComponentFilterDto
{
    public string? Category   { get; set; }
    public string? Search     { get; set; }
    public string? Socket     { get; set; }
    public string? FormFactor { get; set; }
    public string? RamType    { get; set; }
    public string? ChipBrand  { get; set; }
    public decimal? MinPrice  { get; set; }
    public decimal? MaxPrice  { get; set; }
    public string? SortBy     { get; set; } // price-asc | price-desc | name-asc | default
}
