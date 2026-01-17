# Ticketmaster Event Discovery - Backend

ASP.NET Core Web API that serves as gateway to Ticketmaster Discovery API with caching layer.

## Structure

- `Controllers/` - API endpoints
- `Services/` - Business logic and external API integration
- `Models/` - Data models

## Configuration

Set your Ticketmaster API key in `appsettings.Development.json`:

```json
{
  "Ticketmaster": {
    "ApiKey": "YOUR_API_KEY_HERE"
  }
}
```

## Running

```bash
dotnet run
```

API available at http://localhost:5000
Swagger UI at http://localhost:5000/swagger

## Testing

```bash
dotnet test
```
