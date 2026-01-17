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
