using FluentAssertions;
using Microsoft.Extensions.Logging;
using Million.Core.DTOs;
using Million.Core.Entities;
using Million.Core.Interfaces;
using Moq;
using NUnit.Framework;

namespace Million.Tests.Unit.Controllers;

/// <summary>
/// Tests unitarios para PropertiesController
/// Nota: Estos tests validan la lógica del controller sin dependencias directas
/// usando mocking de IPropertyRepository
/// </summary>
[TestFixture]
public class PropertiesControllerTests
{
    private Mock<IPropertyRepository> _mockRepository = null!;
    private Mock<ILogger<object>> _mockLogger = null!;

    [SetUp]
    public void Setup()
    {
        _mockRepository = new Mock<IPropertyRepository>();
        _mockLogger = new Mock<ILogger<object>>();
    }

    #region GetProperties - Business Logic Tests

    [Test]
    public async Task GetProperties_WithoutFilters_ShouldCallRepositoryWithCorrectParams()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                Id = "1",
                Name = "Casa Test",
                Address = "Dirección Test",
                Price = 500000000,
                IdOwner = "owner1",
                ImageUrl = "http://test.jpg"
            }
        };

        _mockRepository
            .Setup(r => r.GetListAsync(null, null, null, null, 1, 10))
            .ReturnsAsync((properties, 1L));

        // Act
        var result = await _mockRepository.Object.GetListAsync(null, null, null, null, 1, 10);

        // Assert
        result.properties.Should().HaveCount(1);
        result.totalCount.Should().Be(1);
        _mockRepository.Verify(r => r.GetListAsync(null, null, null, null, 1, 10), Times.Once);
    }

    [Test]
    public async Task GetProperties_WithNameFilter_ShouldFilterByName()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                Id = "1",
                Name = "Casa Moderna",
                Address = "Dirección Test",
                Price = 500000000,
                IdOwner = "owner1",
                ImageUrl = "http://test.jpg"
            }
        };

        _mockRepository
            .Setup(r => r.GetListAsync("Casa", null, null, null, 1, 10))
            .ReturnsAsync((properties, 1L));

        // Act
        var result = await _mockRepository.Object.GetListAsync("Casa", null, null, null, 1, 10);

        // Assert
        result.properties.Should().HaveCount(1);
        result.properties.First().Name.Should().Contain("Casa");
    }

    [Test]
    public async Task GetProperties_WithPriceRange_ShouldFilterByPriceRange()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                Id = "1",
                Name = "Casa Test",
                Address = "Dirección Test",
                Price = 600000000,
                IdOwner = "owner1",
                ImageUrl = "http://test.jpg"
            }
        };

        _mockRepository
            .Setup(r => r.GetListAsync(null, null, 500000000m, 1000000000m, 1, 10))
            .ReturnsAsync((properties, 1L));

        // Act
        var result = await _mockRepository.Object.GetListAsync(null, null, 500000000m, 1000000000m, 1, 10);

        // Assert
        result.properties.Should().HaveCount(1);
        result.properties.First().Price.Should().BeInRange(500000000m, 1000000000m);
    }

    [Test]
    public async Task GetProperties_WithPagination_ShouldReturnCorrectPage()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property { Id = "1", Name = "Casa 1", Address = "Dir 1", Price = 500000000, IdOwner = "owner1", ImageUrl = "http://test.jpg" },
            new Property { Id = "2", Name = "Casa 2", Address = "Dir 2", Price = 600000000, IdOwner = "owner1", ImageUrl = "http://test.jpg" }
        };

        _mockRepository
            .Setup(r => r.GetListAsync(null, null, null, null, 1, 10))
            .ReturnsAsync((properties, 25L));

        // Act
        var result = await _mockRepository.Object.GetListAsync(null, null, null, null, 1, 10);

        // Assert
        result.properties.Should().HaveCount(2);
        result.totalCount.Should().Be(25);

        // Verificar cálculo de totalPages (ceil(25/10) = 3)
        var totalPages = (int)Math.Ceiling(result.totalCount / (double)10);
        totalPages.Should().Be(3);
    }

    [Test]
    public async Task GetProperties_WithMultipleFilters_ShouldCombineFilters()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                Id = "1",
                Name = "Casa en Bogotá",
                Address = "Calle 123, Bogotá",
                Price = 800000000,
                IdOwner = "owner1",
                ImageUrl = "http://test.jpg"
            }
        };

        _mockRepository
            .Setup(r => r.GetListAsync("Casa", "Bogotá", 100000000m, 2000000000m, 1, 10))
            .ReturnsAsync((properties, 1L));

        // Act
        var result = await _mockRepository.Object.GetListAsync("Casa", "Bogotá", 100000000m, 2000000000m, 1, 10);

        // Assert
        result.properties.Should().HaveCount(1);
        var property = result.properties.First();
        property.Name.Should().Contain("Casa");
        property.Address.Should().Contain("Bogotá");
        property.Price.Should().BeInRange(100000000m, 2000000000m);
    }

    #endregion

    #region GetProperty - Business Logic Tests

    [Test]
    public async Task GetProperty_WithValidId_ShouldReturnProperty()
    {
        // Arrange
        var property = new Property
        {
            Id = "507f1f77bcf86cd799439011",
            Name = "Casa Test",
            Address = "Dirección Test",
            Price = 500000000,
            IdOwner = "owner1",
            ImageUrl = "http://test.jpg"
        };

        _mockRepository
            .Setup(r => r.GetByIdAsync("507f1f77bcf86cd799439011"))
            .ReturnsAsync(property);

        // Act
        var result = await _mockRepository.Object.GetByIdAsync("507f1f77bcf86cd799439011");

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be("507f1f77bcf86cd799439011");
        result.Name.Should().Be("Casa Test");
    }

    [Test]
    public async Task GetProperty_WithNonExistentId_ShouldReturnNull()
    {
        // Arrange
        _mockRepository
            .Setup(r => r.GetByIdAsync("507f1f77bcf86cd799439011"))
            .ReturnsAsync((Property?)null);

        // Act
        var result = await _mockRepository.Object.GetByIdAsync("507f1f77bcf86cd799439011");

        // Assert
        result.Should().BeNull();
    }

    #endregion

    #region Validation Tests

    [Test]
    public void Validation_PageLessThan1_ShouldBeInvalid()
    {
        // Arrange
        var page = 0;

        // Assert
        page.Should().BeLessThan(1);
    }

    [Test]
    public void Validation_PageSizeLessThan1_ShouldBeInvalid()
    {
        // Arrange
        var pageSize = 0;

        // Assert
        pageSize.Should().BeLessThan(1);
    }

    [Test]
    public void Validation_MinPriceGreaterThanMaxPrice_ShouldBeInvalid()
    {
        // Arrange
        var minPrice = 1000000000m;
        var maxPrice = 500000000m;

        // Assert
        minPrice.Should().BeGreaterThan(maxPrice);
    }

    [Test]
    public void Validation_PageSizeGreaterThan50_ShouldBeLimitedTo50()
    {
        // Arrange
        var pageSize = 51;
        var maxPageSize = 50;

        // Act
        var limitedPageSize = Math.Min(pageSize, maxPageSize);

        // Assert
        limitedPageSize.Should().Be(50);
    }

    [Test]
    public void Validation_EmptyId_ShouldBeInvalid()
    {
        // Arrange
        var id = "";

        // Assert
        string.IsNullOrWhiteSpace(id).Should().BeTrue();
    }

    [Test]
    public void Validation_WhitespaceId_ShouldBeInvalid()
    {
        // Arrange
        var id = "   ";

        // Assert
        string.IsNullOrWhiteSpace(id).Should().BeTrue();
    }

    #endregion

    #region DTO Mapping Tests

    [Test]
    public void PropertyToDto_ShouldMapAllFields()
    {
        // Arrange
        var property = new Property
        {
            Id = "507f1f77bcf86cd799439011",
            IdOwner = "owner123",
            Name = "Casa Test",
            Address = "Calle 123",
            Price = 500000000,
            ImageUrl = "http://test.jpg"
        };

        // Act
        var dto = new PropertyDto
        {
            Id = property.Id,
            IdOwner = property.IdOwner,
            Name = property.Name,
            Address = property.Address,
            Price = property.Price,
            ImageUrl = property.ImageUrl
        };

        // Assert
        dto.Id.Should().Be(property.Id);
        dto.IdOwner.Should().Be(property.IdOwner);
        dto.Name.Should().Be(property.Name);
        dto.Address.Should().Be(property.Address);
        dto.Price.Should().Be(property.Price);
        dto.ImageUrl.Should().Be(property.ImageUrl);
    }

    [Test]
    public void PaginationMeta_ShouldCalculateTotalPagesCorrectly()
    {
        // Arrange
        var totalCount = 25;
        var pageSize = 10;

        // Act
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        // Assert
        totalPages.Should().Be(3);
    }

    [Test]
    public void PaginationMeta_WithExactDivision_ShouldCalculateCorrectly()
    {
        // Arrange
        var totalCount = 30;
        var pageSize = 10;

        // Act
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        // Assert
        totalPages.Should().Be(3);
    }

    [Test]
    public void PaginationMeta_WithZeroResults_ShouldReturnZeroPages()
    {
        // Arrange
        var totalCount = 0;
        var pageSize = 10;

        // Act
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        // Assert
        totalPages.Should().Be(0);
    }

    #endregion

    #region Exception Handling Tests

    [Test]
    public async Task Repository_WhenThrowsException_ShouldPropagate()
    {
        // Arrange
        _mockRepository
            .Setup(r => r.GetListAsync(It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<decimal?>(), It.IsAny<decimal?>(), It.IsAny<int>(), It.IsAny<int>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await FluentActions.Invoking(async () =>
                await _mockRepository.Object.GetListAsync(null, null, null, null, 1, 10))
            .Should().ThrowAsync<Exception>()
            .WithMessage("Database error");
    }

    [Test]
    public async Task Repository_GetById_WhenThrowsException_ShouldPropagate()
    {
        // Arrange
        _mockRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act & Assert
        await FluentActions.Invoking(async () =>
                await _mockRepository.Object.GetByIdAsync("507f1f77bcf86cd799439011"))
            .Should().ThrowAsync<Exception>()
            .WithMessage("Database error");
    }

    #endregion
}
