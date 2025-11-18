using Microsoft.AspNetCore.Mvc;
using Million.Core.DTOs;
using Million.Core.Interfaces;

namespace Million.Api.Controllers;

/// <summary>
/// Controller para gestión de propiedades
/// ADAPTER de entrada (Hexagonal Architecture)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyRepository _repository;
    private readonly ILogger<PropertiesController> _logger;

    public PropertiesController(
        IPropertyRepository repository,
        ILogger<PropertiesController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene una lista paginada de propiedades con filtros opcionales
    /// </summary>
    /// <remarks>
    /// Ejepmlo:
    ///
    ///     GET /api/properties?name=Casa&amp;address=Bogotá&amp;minPrice=100000&amp;maxPrice=500000&amp;page=1&amp;pageSize=10
    ///
    /// Todos los filtros son opcionales y se pueden combinar.
    /// La búsqueda por nombre y dirección es case-insensitive y parcial (substring).
    /// </remarks>
    /// <param name="name">Filtro por nombre (búsqueda parcial, case-insensitive). Ejemplo: "Casa"</param>
    /// <param name="address">Filtro por dirección (búsqueda parcial, case-insensitive). Ejemplo: "Bogotá"</param>
    /// <param name="minPrice">Precio mínimo. Ejemplo: 100000</param>
    /// <param name="maxPrice">Precio máximo. Ejemplo: 500000</param>
    /// <param name="page">Número de página (default: 1, mínimo: 1)</param>
    /// <param name="pageSize">Elementos por página (default: 10, mínimo: 1, máximo: 50)</param>
    /// <returns>Lista de propiedades con metadata de paginación</returns>
    /// <response code="200">Retorna la lista de propiedades con metadata de paginación</response>
    /// <response code="400">Parámetros inválidos (ej: page &lt; 1, minPrice &gt; maxPrice)</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpGet]
    [ProducesResponseType(typeof(PropertyListResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PropertyListResponseDto>> GetProperties(
        [FromQuery] string? name,
        [FromQuery] string? address,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            // Validaciones básicas
            if (page < 1)
            {
                return BadRequest(new { message = "Page must be greater than 0" });
            }

            if (pageSize < 1)
            {
                return BadRequest(new { message = "PageSize must be greater than 0" });
            }

            // Limitar a 50 para no matar la BD con queries gigantes
            pageSize = Math.Min(pageSize, 50);

            if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
            {
                return BadRequest(new { message = "MinPrice cannot be greater than MaxPrice" });
            }

            _logger.LogInformation(
                "Getting properties with filters: name={Name}, address={Address}, minPrice={MinPrice}, maxPrice={MaxPrice}, page={Page}, pageSize={PageSize}",
                name, address, minPrice, maxPrice, page, pageSize
            );

            var (properties, totalCount) = await _repository.GetListAsync(
                name, address, minPrice, maxPrice, page, pageSize
            );

            // Convertir a DTO para la respuesta
            var propertyDtos = properties.Select(p => new PropertyDto
            {
                Id = p.Id,
                IdOwner = p.IdOwner,
                Name = p.Name,
                Address = p.Address,
                Price = p.Price,
                ImageUrl = p.ImageUrl
            }).ToList();

            var response = new PropertyListResponseDto
            {
                Data = propertyDtos,
                Meta = new PaginationMetaDto
                {
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                }
            };

            _logger.LogInformation(
                "Successfully retrieved {Count} properties (page {Page} of {TotalPages})",
                propertyDtos.Count, page, response.Meta.TotalPages
            );

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting properties");
            return StatusCode(500, new { message = "An error occurred while retrieving properties" });
        }
    }

    /// <summary>
    /// Obtiene una propiedad específica por su ID
    /// </summary>
    /// <remarks>
    /// Ejemplo de request:
    ///
    ///     GET /api/properties/507f1f77bcf86cd799439011
    ///
    /// El ID debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales).
    /// </remarks>
    /// <param name="id">ID de la propiedad (ObjectId de MongoDB). Ejemplo: "507f1f77bcf86cd799439011"</param>
    /// <returns>Datos completos de la propiedad</returns>
    /// <response code="200">Retorna la propiedad encontrada</response>
    /// <response code="400">ID inválido o vacío</response>
    /// <response code="404">Propiedad no encontrada</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PropertyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PropertyDto>> GetProperty(string id)
    {
        try
        {
            // Validación de ID
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new { message = "Property ID is required" });
            }

            _logger.LogInformation("Getting property with ID: {PropertyId}", id);

            // Obtener propiedad desde el repository
            var property = await _repository.GetByIdAsync(id);

            // Si no existe, retornar 404
            if (property == null)
            {
                _logger.LogWarning("Property with ID {PropertyId} not found", id);
                return NotFound(new { message = $"Property with ID '{id}' not found" });
            }

            // Mapear de Property (Domain) → PropertyDto (API Response)
            var dto = new PropertyDto
            {
                Id = property.Id,
                IdOwner = property.IdOwner,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                ImageUrl = property.ImageUrl
            };

            _logger.LogInformation("Successfully retrieved property with ID: {PropertyId}", id);

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting property with ID: {PropertyId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the property" });
        }
    }
}
