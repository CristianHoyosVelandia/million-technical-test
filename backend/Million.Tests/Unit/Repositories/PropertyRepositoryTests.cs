using FluentAssertions;
using Microsoft.Extensions.Options;
using Million.Core.Entities;
using Million.Infrastructure.Configuration;
using Million.Infrastructure.Data;
using Million.Infrastructure.Repositories;
using Moq;
using NUnit.Framework;

namespace Million.Tests.Unit.Repositories;

/// <summary>
/// Tests unitarios para PropertyRepository
/// Nota: Estos tests requieren una instancia de MongoDB en ejecución
/// o se pueden extender con MongoDB.Driver.Core para mocking completo
/// </summary>
[TestFixture]
public class PropertyRepositoryTests
{
    private Mock<IOptions<MongoDbSettings>> _mockSettings = null!;
    private MongoDbSettings _settings = null!;

    [SetUp]
    public void Setup()
    {
        _settings = new MongoDbSettings
        {
            ConnectionString = "mongodb://localhost:27017",
            DatabaseName = "milliondb_test",
            PropertiesCollectionName = "properties_test"
        };

        _mockSettings = new Mock<IOptions<MongoDbSettings>>();
        _mockSettings.Setup(x => x.Value).Returns(_settings);
    }

    [Test]
    public void Constructor_ShouldInitializeRepository()
    {
        // Arrange & Act
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);

        // Assert
        repository.Should().NotBeNull();
    }

    [Test]
    [Category("Integration")]
    [Ignore("Requiere MongoDB corriendo - ejecutar manualmente")]
    public async Task GetListAsync_WithoutFilters_ShouldReturnAllEnabledProperties()
    {
        // Arrange
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);

        // Act
        var (properties, totalCount) = await repository.GetListAsync(
            name: null,
            address: null,
            minPrice: null,
            maxPrice: null,
            page: 1,
            pageSize: 10
        );

        // Assert
        properties.Should().NotBeNull();
        properties.Should().BeAssignableTo<IEnumerable<Property>>();
        totalCount.Should().BeGreaterThanOrEqualTo(0);
    }

    [Test]
    [Category("Integration")]
    [Ignore("Requiere MongoDB corriendo - ejecutar manualmente")]
    public async Task GetListAsync_WithNameFilter_ShouldReturnFilteredProperties()
    {
        // Arrange
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);
        var searchName = "Casa";

        // Act
        var (properties, totalCount) = await repository.GetListAsync(
            name: searchName,
            address: null,
            minPrice: null,
            maxPrice: null,
            page: 1,
            pageSize: 10
        );

        // Assert
        properties.Should().NotBeNull();
        properties.Should().OnlyContain(p =>
            p.Name.Contains(searchName, StringComparison.OrdinalIgnoreCase));
    }

    [Test]
    [Category("Integration")]
    [Ignore("Requiere MongoDB corriendo - ejecutar manualmente")]
    public async Task GetListAsync_WithPriceRange_ShouldReturnPropertiesInRange()
    {
        // Arrange
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);
        var minPrice = 200000000m;
        var maxPrice = 1000000000m;

        // Act
        var (properties, totalCount) = await repository.GetListAsync(
            name: null,
            address: null,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: 1,
            pageSize: 10
        );

        // Assert
        properties.Should().NotBeNull();
        properties.Should().OnlyContain(p =>
            p.Price >= minPrice && p.Price <= maxPrice);
    }

    [Test]
    [Category("Integration")]
    [Ignore("Requiere MongoDB corriendo - ejecutar manualmente")]
    public async Task GetListAsync_WithPagination_ShouldReturnCorrectPage()
    {
        // Arrange
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);
        var pageSize = 5;
        var page = 1;

        // Act
        var (properties, totalCount) = await repository.GetListAsync(
            name: null,
            address: null,
            minPrice: null,
            maxPrice: null,
            page: page,
            pageSize: pageSize
        );

        // Assert
        properties.Should().NotBeNull();
        properties.Count().Should().BeLessThanOrEqualTo(pageSize);
    }

    [Test]
    [Category("Integration")]
    [Ignore("Requiere MongoDB corriendo - ejecutar manualmente")]
    public async Task GetByIdAsync_WithValidId_ShouldReturnProperty()
    {
        // Arrange
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);

        // Primero obtenemos un ID válido
        var (properties, _) = await repository.GetListAsync(null, null, null, null, 1, 1);
        var validId = properties.FirstOrDefault()?.Id;

        if (validId == null)
        {
            Assert.Inconclusive("No hay propiedades en la base de datos para probar");
            return;
        }

        // Act
        var property = await repository.GetByIdAsync(validId);

        // Assert
        property.Should().NotBeNull();
        property!.Id.Should().Be(validId);
    }

    [Test]
    [Category("Integration")]
    [Ignore("Requiere MongoDB corriendo - ejecutar manualmente")]
    public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);
        var invalidId = "507f1f77bcf86cd799439011"; // ID válido de MongoDB pero no existe

        // Act
        var property = await repository.GetByIdAsync(invalidId);

        // Assert
        property.Should().BeNull();
    }

    [Test]
    [Category("Integration")]
    [Ignore("Requiere MongoDB corriendo - ejecutar manualmente")]
    public async Task GetListAsync_WithMultipleFilters_ShouldReturnMatchingProperties()
    {
        // Arrange
        var context = new MongoDbContext(_mockSettings.Object);
        var repository = new PropertyRepository(context);

        // Act
        var (properties, totalCount) = await repository.GetListAsync(
            name: "Casa",
            address: "Bogotá",
            minPrice: 100000000m,
            maxPrice: 2000000000m,
            page: 1,
            pageSize: 10
        );

        // Assert
        properties.Should().NotBeNull();
        properties.Should().OnlyContain(p =>
            p.Name.Contains("Casa", StringComparison.OrdinalIgnoreCase) &&
            p.Address.Contains("Bogotá", StringComparison.OrdinalIgnoreCase) &&
            p.Price >= 100000000m &&
            p.Price <= 2000000000m
        );
    }
}
