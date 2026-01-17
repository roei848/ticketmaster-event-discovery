# Ticketmaster Event Discovery App - Design Document

**Date:** 2026-01-17

## Overview

A full-stack event discovery application that allows users to search for events worldwide using the Ticketmaster API. Users can filter by location (city + radius) and event types, view event details, and purchase tickets through Ticketmaster.

## Technology Stack

- **Frontend:** React 18 + TypeScript, Vite, Axios
- **Backend:** ASP.NET Core 8.0 Web API, IMemoryCache
- **Architecture:** Monorepo with separate frontend/backend folders
- **Development:** Frontend (localhost:5173), Backend (localhost:5000)

## Project Structure

```
ticketmaster-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── TicketmasterApp.Api/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Models/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   └── TicketmasterApp.sln
└── README.md
```

## Frontend Design

### Components

**SearchBar Component**
- City input with autocomplete from static city list
- Radius selector (5, 10, 25, 50, 100 miles)
- Event type checkboxes (Music, Sports, Arts & Theatre, Family, etc.)
- Search button

**EventGrid Component**
- Responsive grid layout (3-4 columns desktop, 1-2 mobile)
- Event cards showing: image, name, date/time, venue, city/country
- Click opens event details

**EventDetail Component**
- Full event information (description, venue address, date/time, price range)
- "Buy Tickets" button linking to Ticketmaster
- Back/close navigation

**App Component**
- Main container managing search state
- Loading states and error handling
- "No results" messaging

### User Flow

1. User enters city name (autocomplete suggests matches)
2. Selects radius and event types
3. Clicks Search
4. Frontend calls `/api/events/search`
5. Results display in grid
6. User clicks event → detail view opens
7. User clicks "Buy Tickets" → Ticketmaster opens in new tab

## Backend Design

### API Endpoints

**GET /api/events/search**
- Query params: `city`, `radius`, `eventTypes[]`
- Returns: Array of Event objects
- Example: `/api/events/search?city=London&radius=25&eventTypes=music&eventTypes=sports`

**GET /api/events/{id}**
- Path param: Ticketmaster event ID
- Returns: EventDetail object

### Services

**TicketmasterService**
- Handles all Ticketmaster Discovery API communication
- Manages API key and authentication
- Transforms API responses to internal models
- Handles errors and rate limiting

**CacheService (IMemoryCache wrapper)**
- Cache key: `events_{city}_{radius}_{eventTypes}`
- TTL: 30 minutes (search results), 60 minutes (event details)
- Automatic eviction based on TTL
- Reduces API calls for repeated searches

### Data Flow

1. Request → EventsController
2. Check CacheService for cached results
3. Cache miss → TicketmasterService calls external API
4. Apply filtering logic
5. Store in cache
6. Return JSON to frontend

## Data Models

### Event
```typescript
interface Event {
  id: string;
  name: string;
  imageUrl: string;
  date: string;  // ISO format
  venueName: string;
  city: string;
  country: string;
  category: string;
  ticketmasterUrl: string;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}
```

### EventDetail
```typescript
interface EventDetail extends Event {
  description?: string;
  venueAddress: string;
  latitude: number;
  longitude: number;
  promoter?: string;
}
```

### SearchRequest (Backend validation)
- City: required, non-empty string
- Radius: required, valid values (5, 10, 25, 50, 100)
- EventTypes: optional array of valid categories

## Configuration

### Backend (appsettings.json)
```json
{
  "Ticketmaster": {
    "ApiKey": "YOUR_API_KEY_HERE",
    "BaseUrl": "https://app.ticketmaster.com/discovery/v2/",
    "RateLimitPerSecond": 5
  },
  "Cache": {
    "SearchResultsTtlMinutes": 30,
    "EventDetailTtlMinutes": 60
  }
}
```

### Frontend City List
- JSON file with 500-1000 major cities worldwide
- Structure: `{ name: "London", country: "UK", lat: 51.51, lon: -0.13 }`
- Used for autocomplete
- Coordinates passed to Ticketmaster API geopoint parameter
- Source: GeoNames or SimpleMaps dataset

## Key Design Decisions

1. **No user accounts** - Simple public search tool
2. **In-memory caching** - Simple, fast, sufficient for initial scale
3. **Static city list** - Faster autocomplete, can add API later
4. **Multiple event type selection** - More flexible discovery
5. **Grid view with images** - Visual, engaging presentation
6. **Monorepo structure** - Balance of separation and simplicity
7. **Backend-only API access** - Security (API key) and caching control
8. **Worldwide city support** - Not limited to US market
