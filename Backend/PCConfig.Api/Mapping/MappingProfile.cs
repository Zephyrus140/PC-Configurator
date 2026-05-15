using AutoMapper;
using PCConfig.Api.DTOs;
using PCConfig.Api.Models;
using System.Text.Json;

namespace PCConfig.Api.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Component, ComponentDto>()
            .ForMember(d => d.Specs, opt => opt.MapFrom(src => DeserializeList(src.SpecsJson)))
            .ForMember(d => d.SupportedFormFactors, opt => opt.MapFrom(src =>
                src.SupportedFormFactorsJson != null
                    ? DeserializeList(src.SupportedFormFactorsJson)
                    : null));

        CreateMap<Build, BuildDto>();

        CreateMap<BuildItem, BuildItemDto>()
            .ForMember(d => d.ComponentName, opt => opt.MapFrom(src =>
                $"{src.Component.Brand} {src.Component.Name}"))
            .ForMember(d => d.Price, opt => opt.MapFrom(src => src.Component.Price));
    }

    private static List<string> DeserializeList(string json)
        => JsonSerializer.Deserialize<List<string>>(json) ?? [];
}
