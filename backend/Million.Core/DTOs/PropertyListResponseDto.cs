namespace Million.Core.DTOs;

public class PropertyListResponseDto
{
    public List<PropertyDto> Data { get; set; } = new();
    public PaginationMetaDto Meta { get; set; } = new();
}
