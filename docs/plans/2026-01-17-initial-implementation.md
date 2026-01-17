# Ticketmaster Event Discovery App - Initial Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-stack event discovery application with React/TypeScript frontend and C# ASP.NET Core backend that integrates with Ticketmaster API.

**Architecture:** Monorepo with separate frontend/backend folders. Backend serves as API gateway to Ticketmaster with caching layer. Frontend is SPA that communicates via REST API.

**Tech Stack:** React 18, TypeScript, Vite, Axios, ASP.NET Core 8.0, IMemoryCache

---

## Task 1: Backend Project Setup

**Files:**
- Create: `backend/TicketmasterApp.Api/TicketmasterApp.Api.csproj`
- Create: `backend/TicketmasterApp.Api/Program.cs`
- Create: `backend/TicketmasterApp.Api/appsettings.json`
- Create: `backend/TicketmasterApp.Api/appsettings.Development.json`
- Create: `backend/.gitignore`

**Step 1: Create backend directory and solution**

```bash
mkdir -p backend/TicketmasterApp.Api
cd backend
dotnet new sln -n TicketmasterApp
dotnet new webapi -n TicketmasterApp.Api -o TicketmasterApp.Api
dotnet sln add TicketmasterApp.Api/TicketmasterApp.Api.csproj
```

**Step 2: Configure Program.cs for CORS and caching**

File: `backend/TicketmasterApp.Api/Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
```

**Step 3: Configure appsettings.json**

File: `backend/TicketmasterApp.Api/appsettings.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Ticketmaster": {
    "ApiKey": "",
    "BaseUrl": "https://app.ticketmaster.com/discovery/v2/",
    "RateLimitPerSecond": 5
  },
  "Cache": {
    "SearchResultsTtlMinutes": 30,
    "EventDetailTtlMinutes": 60
  }
}
```

**Step 4: Configure appsettings.Development.json**

File: `backend/TicketmasterApp.Api/appsettings.Development.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  },
  "Ticketmaster": {
    "ApiKey": "YOUR_DEV_API_KEY_HERE"
  }
}
```

**Step 5: Create .gitignore for backend**

File: `backend/.gitignore`

```
bin/
obj/
*.user
*.suo
.vs/
appsettings.Development.json
```

**Step 6: Test backend runs**

```bash
cd backend/TicketmasterApp.Api
dotnet run
```

Expected: Server starts on http://localhost:5000, Swagger available at http://localhost:5000/swagger

**Step 7: Commit backend setup**

```bash
git add backend/
git commit -m "feat: set up ASP.NET Core backend with CORS and caching"
```

---

## Task 2: Backend Models

**Files:**
- Create: `backend/TicketmasterApp.Api/Models/Event.cs`
- Create: `backend/TicketmasterApp.Api/Models/EventDetail.cs`
- Create: `backend/TicketmasterApp.Api/Models/PriceRange.cs`
- Create: `backend/TicketmasterApp.Api/Models/SearchRequest.cs`

**Step 1: Create PriceRange model**

File: `backend/TicketmasterApp.Api/Models/PriceRange.cs`

```csharp
namespace TicketmasterApp.Api.Models;

public class PriceRange
{
    public decimal Min { get; set; }
    public decimal Max { get; set; }
    public string Currency { get; set; } = "USD";
}
```

**Step 2: Create Event model**

File: `backend/TicketmasterApp.Api/Models/Event.cs`

```csharp
namespace TicketmasterApp.Api.Models;

public class Event
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string VenueName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string TicketmasterUrl { get; set; } = string.Empty;
    public PriceRange? PriceRange { get; set; }
}
```

**Step 3: Create EventDetail model**

File: `backend/TicketmasterApp.Api/Models/EventDetail.cs`

```csharp
namespace TicketmasterApp.Api.Models;

public class EventDetail : Event
{
    public string? Description { get; set; }
    public string VenueAddress { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Promoter { get; set; }
}
```

**Step 4: Create SearchRequest model**

File: `backend/TicketmasterApp.Api/Models/SearchRequest.cs`

```csharp
using System.ComponentModel.DataAnnotations;

namespace TicketmasterApp.Api.Models;

public class SearchRequest
{
    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    [Range(5, 100)]
    public int Radius { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public List<string> EventTypes { get; set; } = new();
}
```

**Step 5: Commit models**

```bash
git add backend/TicketmasterApp.Api/Models/
git commit -m "feat: add data models for events and search"
```

---

## Task 3: Backend Services - TicketmasterService

**Files:**
- Create: `backend/TicketmasterApp.Api/Services/ITicketmasterService.cs`
- Create: `backend/TicketmasterApp.Api/Services/TicketmasterService.cs`

**Step 1: Create ITicketmasterService interface**

File: `backend/TicketmasterApp.Api/Services/ITicketmasterService.cs`

```csharp
using TicketmasterApp.Api.Models;

namespace TicketmasterApp.Api.Services;

public interface ITicketmasterService
{
    Task<List<Event>> SearchEventsAsync(SearchRequest request);
    Task<EventDetail?> GetEventDetailAsync(string eventId);
}
```

**Step 2: Create TicketmasterService implementation**

File: `backend/TicketmasterApp.Api/Services/TicketmasterService.cs`

```csharp
using System.Text.Json;
using TicketmasterApp.Api.Models;

namespace TicketmasterApp.Api.Services;

public class TicketmasterService : ITicketmasterService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<TicketmasterService> _logger;

    public TicketmasterService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<TicketmasterService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<List<Event>> SearchEventsAsync(SearchRequest request)
    {
        var apiKey = _configuration["Ticketmaster:ApiKey"];
        var baseUrl = _configuration["Ticketmaster:BaseUrl"];

        var geoPoint = $"{request.Latitude},{request.Longitude}";
        var radiusInMiles = $"{request.Radius}miles";

        var url = $"{baseUrl}events.json?apikey={apiKey}&geoPoint={geoPoint}&radius={radiusInMiles}&size=50";

        if (request.EventTypes.Any())
        {
            var classificationName = string.Join(",", request.EventTypes);
            url += $"&classificationName={classificationName}";
        }

        try
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var ticketmasterResponse = JsonSerializer.Deserialize<TicketmasterEventsResponse>(content);

            return MapToEvents(ticketmasterResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Ticketmaster API");
            return new List<Event>();
        }
    }

    public async Task<EventDetail?> GetEventDetailAsync(string eventId)
    {
        var apiKey = _configuration["Ticketmaster:ApiKey"];
        var baseUrl = _configuration["Ticketmaster:BaseUrl"];

        var url = $"{baseUrl}events/{eventId}.json?apikey={apiKey}";

        try
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var ticketmasterEvent = JsonSerializer.Deserialize<TicketmasterEventResponse>(content);

            return MapToEventDetail(ticketmasterEvent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting event detail from Ticketmaster");
            return null;
        }
    }

    private List<Event> MapToEvents(TicketmasterEventsResponse? response)
    {
        if (response?._embedded?.events == null)
            return new List<Event>();

        return response._embedded.events.Select(e => new Event
        {
            Id = e.id ?? string.Empty,
            Name = e.name ?? string.Empty,
            ImageUrl = e.images?.FirstOrDefault()?.url ?? string.Empty,
            Date = e.dates?.start?.dateTime ?? string.Empty,
            VenueName = e._embedded?.venues?.FirstOrDefault()?.name ?? string.Empty,
            City = e._embedded?.venues?.FirstOrDefault()?.city?.name ?? string.Empty,
            Country = e._embedded?.venues?.FirstOrDefault()?.country?.name ?? string.Empty,
            Category = e.classifications?.FirstOrDefault()?.segment?.name ?? string.Empty,
            TicketmasterUrl = e.url ?? string.Empty,
            PriceRange = e.priceRanges?.FirstOrDefault() != null ? new PriceRange
            {
                Min = e.priceRanges.First().min,
                Max = e.priceRanges.First().max,
                Currency = e.priceRanges.First().currency ?? "USD"
            } : null
        }).ToList();
    }

    private EventDetail? MapToEventDetail(TicketmasterEventResponse? response)
    {
        if (response == null) return null;

        var venue = response._embedded?.venues?.FirstOrDefault();

        return new EventDetail
        {
            Id = response.id ?? string.Empty,
            Name = response.name ?? string.Empty,
            ImageUrl = response.images?.FirstOrDefault()?.url ?? string.Empty,
            Date = response.dates?.start?.dateTime ?? string.Empty,
            VenueName = venue?.name ?? string.Empty,
            City = venue?.city?.name ?? string.Empty,
            Country = venue?.country?.name ?? string.Empty,
            Category = response.classifications?.FirstOrDefault()?.segment?.name ?? string.Empty,
            TicketmasterUrl = response.url ?? string.Empty,
            Description = response.info ?? response.pleaseNote,
            VenueAddress = venue?.address?.line1 ?? string.Empty,
            Latitude = venue?.location?.latitude ?? 0,
            Longitude = venue?.location?.longitude ?? 0,
            Promoter = response.promoter?.name,
            PriceRange = response.priceRanges?.FirstOrDefault() != null ? new PriceRange
            {
                Min = response.priceRanges.First().min,
                Max = response.priceRanges.First().max,
                Currency = response.priceRanges.First().currency ?? "USD"
            } : null
        };
    }

    // DTOs for Ticketmaster API response
    private class TicketmasterEventsResponse
    {
        public Embedded? _embedded { get; set; }
        public class Embedded
        {
            public List<TicketmasterEventDto>? events { get; set; }
        }
    }

    private class TicketmasterEventResponse
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? url { get; set; }
        public string? info { get; set; }
        public string? pleaseNote { get; set; }
        public List<ImageDto>? images { get; set; }
        public DatesDto? dates { get; set; }
        public List<ClassificationDto>? classifications { get; set; }
        public List<PriceRangeDto>? priceRanges { get; set; }
        public PromoterDto? promoter { get; set; }
        public EmbeddedVenuesDto? _embedded { get; set; }
    }

    private class TicketmasterEventDto
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? url { get; set; }
        public List<ImageDto>? images { get; set; }
        public DatesDto? dates { get; set; }
        public List<ClassificationDto>? classifications { get; set; }
        public List<PriceRangeDto>? priceRanges { get; set; }
        public EmbeddedVenuesDto? _embedded { get; set; }
    }

    private class ImageDto
    {
        public string? url { get; set; }
    }

    private class DatesDto
    {
        public StartDto? start { get; set; }
    }

    private class StartDto
    {
        public string? dateTime { get; set; }
    }

    private class ClassificationDto
    {
        public SegmentDto? segment { get; set; }
    }

    private class SegmentDto
    {
        public string? name { get; set; }
    }

    private class PriceRangeDto
    {
        public decimal min { get; set; }
        public decimal max { get; set; }
        public string? currency { get; set; }
    }

    private class PromoterDto
    {
        public string? name { get; set; }
    }

    private class EmbeddedVenuesDto
    {
        public List<VenueDto>? venues { get; set; }
    }

    private class VenueDto
    {
        public string? name { get; set; }
        public CityDto? city { get; set; }
        public CountryDto? country { get; set; }
        public AddressDto? address { get; set; }
        public LocationDto? location { get; set; }
    }

    private class CityDto
    {
        public string? name { get; set; }
    }

    private class CountryDto
    {
        public string? name { get; set; }
    }

    private class AddressDto
    {
        public string? line1 { get; set; }
    }

    private class LocationDto
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
    }
}
```

**Step 3: Register service in Program.cs**

Modify `backend/TicketmasterApp.Api/Program.cs`:

Add after `builder.Services.AddHttpClient();`:

```csharp
// Register services
builder.Services.AddScoped<ITicketmasterService, TicketmasterService>();
```

**Step 4: Commit TicketmasterService**

```bash
git add backend/TicketmasterApp.Api/Services/ backend/TicketmasterApp.Api/Program.cs
git commit -m "feat: add TicketmasterService for API integration"
```

---

## Task 4: Backend Services - CacheService

**Files:**
- Create: `backend/TicketmasterApp.Api/Services/ICacheService.cs`
- Create: `backend/TicketmasterApp.Api/Services/CacheService.cs`

**Step 1: Create ICacheService interface**

File: `backend/TicketmasterApp.Api/Services/ICacheService.cs`

```csharp
namespace TicketmasterApp.Api.Services;

public interface ICacheService
{
    T? Get<T>(string key);
    void Set<T>(string key, T value, TimeSpan expiration);
    string GenerateSearchKey(string city, int radius, List<string> eventTypes);
}
```

**Step 2: Create CacheService implementation**

File: `backend/TicketmasterApp.Api/Services/CacheService.cs`

```csharp
using Microsoft.Extensions.Caching.Memory;

namespace TicketmasterApp.Api.Services;

public class CacheService : ICacheService
{
    private readonly IMemoryCache _cache;

    public CacheService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public T? Get<T>(string key)
    {
        return _cache.TryGetValue(key, out T? value) ? value : default;
    }

    public void Set<T>(string key, T value, TimeSpan expiration)
    {
        _cache.Set(key, value, expiration);
    }

    public string GenerateSearchKey(string city, int radius, List<string> eventTypes)
    {
        var eventTypesString = eventTypes.Any()
            ? string.Join("-", eventTypes.OrderBy(t => t))
            : "all";

        return $"events_{city.ToLower()}_{radius}_{eventTypesString}";
    }
}
```

**Step 3: Register service in Program.cs**

Modify `backend/TicketmasterApp.Api/Program.cs`:

Add after the TicketmasterService registration:

```csharp
builder.Services.AddSingleton<ICacheService, CacheService>();
```

**Step 4: Commit CacheService**

```bash
git add backend/TicketmasterApp.Api/Services/ backend/TicketmasterApp.Api/Program.cs
git commit -m "feat: add CacheService for response caching"
```

---

## Task 5: Backend Controller - EventsController

**Files:**
- Create: `backend/TicketmasterApp.Api/Controllers/EventsController.cs`

**Step 1: Create EventsController**

File: `backend/TicketmasterApp.Api/Controllers/EventsController.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using TicketmasterApp.Api.Models;
using TicketmasterApp.Api.Services;

namespace TicketmasterApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly ITicketmasterService _ticketmasterService;
    private readonly ICacheService _cacheService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EventsController> _logger;

    public EventsController(
        ITicketmasterService ticketmasterService,
        ICacheService cacheService,
        IConfiguration configuration,
        ILogger<EventsController> logger)
    {
        _ticketmasterService = ticketmasterService;
        _cacheService = cacheService;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<Event>>> Search(
        [FromQuery] string city,
        [FromQuery] int radius,
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        [FromQuery] List<string>? eventTypes = null)
    {
        if (string.IsNullOrWhiteSpace(city))
            return BadRequest("City is required");

        if (radius < 5 || radius > 100)
            return BadRequest("Radius must be between 5 and 100 miles");

        var searchRequest = new SearchRequest
        {
            City = city,
            Radius = radius,
            Latitude = latitude,
            Longitude = longitude,
            EventTypes = eventTypes ?? new List<string>()
        };

        // Check cache
        var cacheKey = _cacheService.GenerateSearchKey(city, radius, searchRequest.EventTypes);
        var cachedEvents = _cacheService.Get<List<Event>>(cacheKey);

        if (cachedEvents != null)
        {
            _logger.LogInformation("Returning cached results for {CacheKey}", cacheKey);
            return Ok(cachedEvents);
        }

        // Fetch from API
        var events = await _ticketmasterService.SearchEventsAsync(searchRequest);

        // Cache results
        var ttl = TimeSpan.FromMinutes(_configuration.GetValue<int>("Cache:SearchResultsTtlMinutes"));
        _cacheService.Set(cacheKey, events, ttl);

        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDetail>> GetEventDetail(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest("Event ID is required");

        // Check cache
        var cacheKey = $"event_{id}";
        var cachedEvent = _cacheService.Get<EventDetail>(cacheKey);

        if (cachedEvent != null)
        {
            _logger.LogInformation("Returning cached event detail for {EventId}", id);
            return Ok(cachedEvent);
        }

        // Fetch from API
        var eventDetail = await _ticketmasterService.GetEventDetailAsync(id);

        if (eventDetail == null)
            return NotFound();

        // Cache result
        var ttl = TimeSpan.FromMinutes(_configuration.GetValue<int>("Cache:EventDetailTtlMinutes"));
        _cacheService.Set(cacheKey, eventDetail, ttl);

        return Ok(eventDetail);
    }
}
```

**Step 2: Delete default WeatherForecast files**

```bash
cd backend/TicketmasterApp.Api
rm -f Controllers/WeatherForecastController.cs WeatherForecast.cs
```

**Step 3: Test backend compiles and runs**

```bash
cd backend/TicketmasterApp.Api
dotnet build
dotnet run
```

Expected: Build succeeds, server starts, Swagger shows /api/events/search and /api/events/{id} endpoints

**Step 4: Commit EventsController**

```bash
git add backend/
git commit -m "feat: add EventsController with caching support"
```

---

## Task 6: Frontend Project Setup

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/App.css`

**Step 1: Create frontend with Vite**

```bash
cd ../..
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

**Step 2: Install dependencies**

```bash
npm install axios
```

**Step 3: Update vite.config.ts for proxy**

File: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

**Step 4: Create basic App.tsx**

File: `frontend/src/App.tsx`

```tsx
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Ticketmaster Event Discovery</h1>
      <p>Find events near you</p>
    </div>
  )
}

export default App
```

**Step 5: Test frontend runs**

```bash
npm run dev
```

Expected: Frontend starts on http://localhost:5173

**Step 6: Commit frontend setup**

```bash
git add frontend/
git commit -m "feat: set up React TypeScript frontend with Vite"
```

---

## Task 7: Frontend Types and Data

**Files:**
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/data/cities.ts`

**Step 1: Create TypeScript types**

File: `frontend/src/types/index.ts`

```typescript
export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Event {
  id: string;
  name: string;
  imageUrl: string;
  date: string;
  venueName: string;
  city: string;
  country: string;
  category: string;
  ticketmasterUrl: string;
  priceRange?: PriceRange;
}

export interface EventDetail extends Event {
  description?: string;
  venueAddress: string;
  latitude: number;
  longitude: number;
  promoter?: string;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface SearchParams {
  city: string;
  radius: number;
  latitude: number;
  longitude: number;
  eventTypes: string[];
}
```

**Step 2: Create cities data (sample worldwide cities)**

File: `frontend/src/data/cities.ts`

```typescript
import { City } from '../types';

export const cities: City[] = [
  // North America
  { name: "New York", country: "USA", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", country: "USA", lat: 41.8781, lon: -87.6298 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332 },

  // Europe
  { name: "London", country: "UK", lat: 51.5074, lon: -0.1278 },
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
  { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 },

  // Asia
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.9780 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Hong Kong", country: "China", lat: 22.3193, lon: 114.1694 },

  // Australia
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631 },

  // South America
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816 },
];
```

**Step 3: Commit types and data**

```bash
git add frontend/src/types/ frontend/src/data/
git commit -m "feat: add TypeScript types and city data"
```

---

## Task 8: Frontend API Service

**Files:**
- Create: `frontend/src/services/api.ts`

**Step 1: Create API service**

File: `frontend/src/services/api.ts`

```typescript
import axios from 'axios';
import { Event, EventDetail, SearchParams } from '../types';

const API_BASE_URL = '/api';

export const searchEvents = async (params: SearchParams): Promise<Event[]> => {
  const queryParams = new URLSearchParams({
    city: params.city,
    radius: params.radius.toString(),
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
  });

  params.eventTypes.forEach(type => {
    queryParams.append('eventTypes', type);
  });

  const response = await axios.get<Event[]>(
    `${API_BASE_URL}/events/search?${queryParams.toString()}`
  );

  return response.data;
};

export const getEventDetail = async (eventId: string): Promise<EventDetail> => {
  const response = await axios.get<EventDetail>(
    `${API_BASE_URL}/events/${eventId}`
  );

  return response.data;
};
```

**Step 2: Commit API service**

```bash
git add frontend/src/services/
git commit -m "feat: add API service for backend communication"
```

---

## Task 9: Frontend SearchBar Component

**Files:**
- Create: `frontend/src/components/SearchBar.tsx`
- Create: `frontend/src/components/SearchBar.css`

**Step 1: Create SearchBar component**

File: `frontend/src/components/SearchBar.tsx`

```tsx
import { useState, useMemo } from 'react';
import { City } from '../types';
import './SearchBar.css';

interface SearchBarProps {
  cities: City[];
  onSearch: (city: City, radius: number, eventTypes: string[]) => void;
}

const EVENT_CATEGORIES = ['Music', 'Sports', 'Arts & Theatre', 'Family'];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

export default function SearchBar({ cities, onSearch }: SearchBarProps) {
  const [cityInput, setCityInput] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [radius, setRadius] = useState(25);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = useMemo(() => {
    if (!cityInput) return [];

    return cities
      .filter(city =>
        city.name.toLowerCase().includes(cityInput.toLowerCase()) ||
        city.country.toLowerCase().includes(cityInput.toLowerCase())
      )
      .slice(0, 5);
  }, [cityInput, cities]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityInput(`${city.name}, ${city.country}`);
    setShowSuggestions(false);
  };

  const handleEventTypeToggle = (eventType: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(eventType)
        ? prev.filter(t => t !== eventType)
        : [...prev, eventType]
    );
  };

  const handleSearch = () => {
    if (!selectedCity) {
      alert('Please select a city');
      return;
    }

    onSearch(selectedCity, radius, selectedEventTypes);
  };

  return (
    <div className="search-bar">
      <div className="search-row">
        <div className="city-input-container">
          <input
            type="text"
            placeholder="Enter city name..."
            value={cityInput}
            onChange={(e) => {
              setCityInput(e.target.value);
              setSelectedCity(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="city-input"
          />

          {showSuggestions && filteredCities.length > 0 && (
            <ul className="city-suggestions">
              {filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="city-suggestion-item"
                >
                  {city.name}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="radius-container">
          <label>Radius:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="radius-select"
          >
            {RADIUS_OPTIONS.map(r => (
              <option key={r} value={r}>{r} miles</option>
            ))}
          </select>
        </div>

        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="event-types">
        <label>Event Types:</label>
        <div className="event-type-checkboxes">
          {EVENT_CATEGORIES.map(category => (
            <label key={category} className="event-type-label">
              <input
                type="checkbox"
                checked={selectedEventTypes.includes(category)}
                onChange={() => handleEventTypeToggle(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create SearchBar styles**

File: `frontend/src/components/SearchBar.css`

```css
.search-bar {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.search-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.city-input-container {
  position: relative;
  flex: 1;
}

.city-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.city-input:focus {
  outline: none;
  border-color: #1976d2;
}

.city-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  list-style: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.city-suggestion-item {
  padding: 12px;
  cursor: pointer;
}

.city-suggestion-item:hover {
  background: #f5f5f5;
}

.radius-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radius-select {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-button {
  padding: 12px 32px;
  font-size: 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background: #1565c0;
}

.event-types {
  display: flex;
  align-items: center;
  gap: 16px;
}

.event-type-checkboxes {
  display: flex;
  gap: 16px;
}

.event-type-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
```

**Step 3: Commit SearchBar component**

```bash
git add frontend/src/components/
git commit -m "feat: add SearchBar component with city autocomplete"
```

---

## Task 10: Frontend EventGrid Component

**Files:**
- Create: `frontend/src/components/EventGrid.tsx`
- Create: `frontend/src/components/EventGrid.css`

**Step 1: Create EventGrid component**

File: `frontend/src/components/EventGrid.tsx`

```tsx
import { Event } from '../types';
import './EventGrid.css';

interface EventGridProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function EventGrid({ events, onEventClick }: EventGridProps) {
  if (events.length === 0) {
    return <div className="no-results">No events found. Try adjusting your search criteria.</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-grid">
      {events.map((event) => (
        <div
          key={event.id}
          className="event-card"
          onClick={() => onEventClick(event)}
        >
          <div className="event-image-container">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.name} className="event-image" />
            ) : (
              <div className="event-image-placeholder">No Image</div>
            )}
          </div>

          <div className="event-info">
            <h3 className="event-name">{event.name}</h3>

            <div className="event-detail">
              <span className="event-date">{formatDate(event.date)}</span>
            </div>

            <div className="event-detail">
              <span className="event-venue">{event.venueName}</span>
            </div>

            <div className="event-detail">
              <span className="event-location">{event.city}, {event.country}</span>
            </div>

            {event.priceRange && (
              <div className="event-price">
                {event.priceRange.currency} {event.priceRange.min} - {event.priceRange.max}
              </div>
            )}

            <span className="event-category">{event.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Create EventGrid styles**

File: `frontend/src/components/EventGrid.css`

```css
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.event-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.event-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.event-info {
  padding: 16px;
}

.event-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.event-detail {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.event-date {
  font-weight: 500;
}

.event-venue {
  color: #555;
}

.event-location {
  color: #777;
}

.event-price {
  margin: 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
}

.event-category {
  display: inline-block;
  padding: 4px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
}

.no-results {
  text-align: center;
  padding: 48px;
  color: #666;
  font-size: 18px;
}
```

**Step 3: Commit EventGrid component**

```bash
git add frontend/src/components/
git commit -m "feat: add EventGrid component for displaying events"
```

---

## Task 11: Frontend EventDetail Modal

**Files:**
- Create: `frontend/src/components/EventDetailModal.tsx`
- Create: `frontend/src/components/EventDetailModal.css`

**Step 1: Create EventDetailModal component**

File: `frontend/src/components/EventDetailModal.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Event, EventDetail } from '../types';
import { getEventDetail } from '../services/api';
import './EventDetailModal.css';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const detail = await getEventDetail(event.id);
        setEventDetail(detail);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [event.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {loading && <div className="modal-loading">Loading...</div>}

        {error && <div className="modal-error">{error}</div>}

        {eventDetail && !loading && (
          <>
            {eventDetail.imageUrl && (
              <img src={eventDetail.imageUrl} alt={eventDetail.name} className="modal-image" />
            )}

            <div className="modal-body">
              <h2 className="modal-title">{eventDetail.name}</h2>

              <div className="modal-section">
                <h3>When</h3>
                <p>{formatDate(eventDetail.date)}</p>
              </div>

              <div className="modal-section">
                <h3>Where</h3>
                <p><strong>{eventDetail.venueName}</strong></p>
                {eventDetail.venueAddress && <p>{eventDetail.venueAddress}</p>}
                <p>{eventDetail.city}, {eventDetail.country}</p>
              </div>

              {eventDetail.description && (
                <div className="modal-section">
                  <h3>About</h3>
                  <p>{eventDetail.description}</p>
                </div>
              )}

              {eventDetail.priceRange && (
                <div className="modal-section">
                  <h3>Price Range</h3>
                  <p className="modal-price">
                    {eventDetail.priceRange.currency} {eventDetail.priceRange.min} - {eventDetail.priceRange.max}
                  </p>
                </div>
              )}

              {eventDetail.promoter && (
                <div className="modal-section">
                  <h3>Promoter</h3>
                  <p>{eventDetail.promoter}</p>
                </div>
              )}

              <a
                href={eventDetail.ticketmasterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-tickets-button"
              >
                Buy Tickets on Ticketmaster
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create EventDetailModal styles**

File: `frontend/src/components/EventDetailModal.css`

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  border: none;
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.modal-close:hover {
  background: #f5f5f5;
}

.modal-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.modal-body {
  padding: 32px;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: #333;
}

.modal-section {
  margin-bottom: 24px;
}

.modal-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.modal-section p {
  margin: 4px 0;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
}

.modal-price {
  font-size: 20px;
  font-weight: 600;
  color: #1976d2;
}

.buy-tickets-button {
  display: block;
  width: 100%;
  padding: 16px;
  background: #1976d2;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  margin-top: 32px;
  transition: background 0.2s;
}

.buy-tickets-button:hover {
  background: #1565c0;
}

.modal-loading,
.modal-error {
  padding: 48px;
  text-align: center;
  color: #666;
}

.modal-error {
  color: #d32f2f;
}
```

**Step 3: Commit EventDetailModal component**

```bash
git add frontend/src/components/
git commit -m "feat: add EventDetailModal for viewing event details"
```

---

## Task 12: Integrate Components in App

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/App.css`

**Step 1: Update App.tsx with state management and component integration**

File: `frontend/src/App.tsx`

```tsx
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import EventGrid from './components/EventGrid';
import EventDetailModal from './components/EventDetailModal';
import { cities } from './data/cities';
import { searchEvents } from './services/api';
import { Event, City } from './types';
import './App.css';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (city: City, radius: number, eventTypes: string[]) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const results = await searchEvents({
        city: city.name,
        radius,
        latitude: city.lat,
        longitude: city.lon,
        eventTypes
      });

      setEvents(results);
    } catch (err) {
      setError('Failed to search events. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ticketmaster Event Discovery</h1>
        <p>Find events near you worldwide</p>
      </header>

      <main className="app-main">
        <SearchBar cities={cities} onSearch={handleSearch} />

        {loading && <div className="loading">Searching for events...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && hasSearched && <EventGrid events={events} onEventClick={setSelectedEvent} />}
      </main>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

export default App;
```

**Step 2: Update App.css**

File: `frontend/src/App.css`

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
}

.app {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 48px 24px;
  text-align: center;
}

.app-header h1 {
  margin: 0 0 8px 0;
  font-size: 36px;
  font-weight: 700;
}

.app-header p {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

.loading,
.error {
  text-align: center;
  padding: 48px;
  font-size: 18px;
}

.loading {
  color: #666;
}

.error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 8px;
}
```

**Step 3: Test full application**

Start backend:
```bash
cd backend/TicketmasterApp.Api
dotnet run
```

Start frontend (in new terminal):
```bash
cd frontend
npm run dev
```

Expected: Full app functional - search, view results, click event for details

**Step 4: Commit integrated App**

```bash
git add frontend/src/App.tsx frontend/src/App.css
git commit -m "feat: integrate all components in main App"
```

---

## Task 13: Documentation and README

**Files:**
- Create: `README.md`
- Create: `backend/README.md`
- Create: `frontend/README.md`

**Step 1: Create main README**

File: `README.md`

```markdown
# Ticketmaster Event Discovery App

A full-stack event discovery application that allows users to search for events worldwide using the Ticketmaster API.

## Features

- Search events by city with radius filter
- Filter by multiple event types (Music, Sports, Arts & Theatre, Family)
- View event details and purchase tickets on Ticketmaster
- Responsive grid layout with event images
- Backend caching for improved performance

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Axios
- **Backend:** ASP.NET Core 8.0, IMemoryCache
- **API:** Ticketmaster Discovery API v2

## Project Structure

```
ticketmaster-app/
├── frontend/          # React TypeScript SPA
├── backend/           # ASP.NET Core Web API
└── docs/             # Design documents and plans
```

## Prerequisites

- Node.js 18+ and npm
- .NET 8.0 SDK
- Ticketmaster API key (get one at https://developer.ticketmaster.com/)

## Setup

### Backend

1. Navigate to backend directory:
   ```bash
   cd backend/TicketmasterApp.Api
   ```

2. Add your Ticketmaster API key to `appsettings.Development.json`:
   ```json
   {
     "Ticketmaster": {
       "ApiKey": "YOUR_API_KEY_HERE"
     }
   }
   ```

3. Run the backend:
   ```bash
   dotnet run
   ```

Backend runs on http://localhost:5000

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Frontend runs on http://localhost:5173

## Usage

1. Enter a city name (autocomplete will suggest matches)
2. Select search radius (5-100 miles)
3. Optionally select event types to filter
4. Click Search to find events
5. Click on any event card to view details
6. Click "Buy Tickets on Ticketmaster" to purchase

## API Endpoints

- `GET /api/events/search?city=London&radius=25&latitude=51.51&longitude=-0.13&eventTypes=music`
- `GET /api/events/{id}`

## Caching

- Search results: cached for 30 minutes
- Event details: cached for 60 minutes
- Cache keys include city, radius, and event types for precise invalidation

## License

MIT
```

**Step 2: Create backend README**

File: `backend/README.md`

```markdown
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
```

**Step 3: Create frontend README**

File: `frontend/README.md`

```markdown
# Ticketmaster Event Discovery - Frontend

React TypeScript SPA for discovering events worldwide.

## Structure

- `src/components/` - React components
- `src/services/` - API communication
- `src/types/` - TypeScript type definitions
- `src/data/` - Static data (city list)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```
```

**Step 4: Commit documentation**

```bash
git add README.md backend/README.md frontend/README.md
git commit -m "docs: add comprehensive README files"
```

---

## Final Verification

**Step 1: Verify backend builds and runs**

```bash
cd backend/TicketmasterApp.Api
dotnet build
dotnet run
```

Expected: Clean build, server starts, Swagger accessible

**Step 2: Verify frontend builds and runs**

```bash
cd ../../frontend
npm run build
npm run preview
```

Expected: Clean build, preview server starts

**Step 3: Test end-to-end workflow**

1. Start both backend and frontend
2. Search for events in a major city
3. Verify results display
4. Click event to view details
5. Verify "Buy Tickets" link works

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup"
```

---

## Notes

- **API Key Required:** You need a Ticketmaster API key from https://developer.ticketmaster.com/
- **CORS:** Backend configured to allow requests from http://localhost:5173
- **Caching:** Adjust TTL values in `appsettings.json` as needed
- **City List:** Currently ~20 cities, expand in `frontend/src/data/cities.ts` as needed
- **Event Types:** Adjust categories in `SearchBar.tsx` based on Ticketmaster's classification system

## Potential Enhancements

- Add pagination for search results
- Implement map view for events
- Add user favorites (requires backend session/database)
- Expand city list with geocoding API
- Add unit tests for components and services
- Deploy to cloud (Azure, AWS, etc.)
