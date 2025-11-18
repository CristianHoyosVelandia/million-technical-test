# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos de solución y proyectos
COPY ["Million.sln", "./"]
COPY ["Million.Api/Million.Api.csproj", "Million.Api/"]
COPY ["Million.Core/Million.Core.csproj", "Million.Core/"]
COPY ["Million.Infrastructure/Million.Infrastructure.csproj", "Million.Infrastructure/"]
COPY ["Million.Application/Million.Application.csproj", "Million.Application/"]
COPY ["Million.Tests/Million.Tests.csproj", "Million.Tests/"]

# Restaurar dependencias
RUN dotnet restore "Million.sln"

# Copiar el resto del código
COPY . .

# Construir y publicar
WORKDIR "/src/Million.Api"
RUN dotnet publish "Million.Api.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copiar los archivos publicados
COPY --from=build /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "Million.Api.dll"]
