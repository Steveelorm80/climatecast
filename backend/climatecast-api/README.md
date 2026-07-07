# climatecast-api

Unified ClimateCast backend (replaces weather-service + event-service).

## Endpoints

- `GET /weather?city=` — current weather
- `GET /weather/forecast?city=` — 5-day forecast
- `GET /weather/risk?city=&date=` — risk score for a date
- `GET /weather/best-day?city=` — best upcoming day
- `POST /events` — create event, returns `{ event, eventRisk, recommendation, weather }`
- `GET /events`, `GET /events/{id}`, `PUT /events/{id}`, `DELETE /events/{id}`

## Run locally

```bash
# Windows
set OPENWEATHER_API_KEY=your_key && mvnw spring-boot:run
# macOS/Linux
OPENWEATHER_API_KEY=your_key ./mvnw spring-boot:run
```

Uses in-memory H2 and Caffeine cache (10 min TTL) by default — no other setup needed.

## Environment variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `OPENWEATHER_API_KEY` | yes | — | OpenWeatherMap key |
| `JDBC_DATABASE_URL` | prod | H2 in-memory | e.g. `jdbc:postgresql://...` (Neon/Supabase) |
| `JDBC_DATABASE_USERNAME` | prod | `sa` | |
| `JDBC_DATABASE_PASSWORD` | prod | empty | |
| `CACHE_TYPE` | no | `caffeine` | set `redis` for Upstash |
| `REDIS_URL` | if redis | — | e.g. `rediss://default:pass@host:6379` |
| `ALLOWED_ORIGINS` | no | localhost:3000 + vercel app | comma-separated |
| `PORT` | no | 8080 | set by Render |

## Deploy (Render)

One web service, Docker runtime, root directory `backend/climatecast-api`.
Set `OPENWEATHER_API_KEY` and the `JDBC_DATABASE_*` vars in the Render dashboard.
Frontend needs `NEXT_PUBLIC_API_URL` pointed at this service (Vercel env var).
