## F1 Dashboard

A modern Formula 1 dashboard web application that displays live telemetry, standings, schedules, and more. Built with a Go backend and TypeScript/React.

---

## Features

- **Live Dashboard:** Real-time F1 telemetry and session data. (WIP)
- **Standings:** View up-to-date driver and constructor standings.
- **Schedule:** See upcoming race weekends and session times.

---

### Prerequisites

- Node
- Go
- (Optional) Docker

### Local Development 

#### Backend (Go)
```
cd API
go run ./cmd
```

#### Frontend (React)
```
cd Client/F1Dash
npm install
npm run dev
```

### Docker
```
docker-compose up --build
```
---
