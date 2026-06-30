# PLCMON — PLC Monitoring Dashboard

![Status](https://img.shields.io/badge/status-in--development-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Docker](https://img.shields.io/badge/docker-ready-2496ED)

## About

PLCMON is a full-stack industrial automation dashboard built to bridge software engineering and factory-floor monitoring. It simulates a small plant with three PLC-controlled machines and gives operators a real HMI/SCADA-style interface to monitor them: live status, sensor readings, alarms, production counts, and historical trends, all updating in real time over WebSockets.

The project was built as a hands-on way to combine a typical full-stack web app (React, Express, MongoDB, JWT auth) with the kind of data and workflows used in industrial control systems. The PLC layer is currently a simulator that generates realistic sensor data every second, but the backend is structured so that layer can be swapped for a real Modbus TCP or OPC UA connection without touching the rest of the stack.

It also reflects how the project was actually built: iteratively, with authentication and RBAC first, then live data, then each dashboard page, then containerization with Docker.

```
PLC / Sensors (simulated)
        │
        ▼
   Backend API (Node.js + Express)
        │
        ├── MongoDB (persistent storage)
        │
        └── Socket.io (live broadcast)
                │
                ▼
        React Dashboard
```

---

## Features

- **Authentication** — JWT-based login, registration, and password reset, with Admin and Operator roles
- **Live dashboard** — plant-wide KPIs and per-machine status cards updating every second
- **Real-time monitor** — large-format live readouts for temperature, speed, and current per machine
- **Alarm management** — searchable, filterable alarm log with acknowledge workflow
- **Historical data** — line charts of temperature, speed, current, energy, and production count
- **User management** — admin-only CRUD for user accounts with role-based access control (RBAC)
- **PLC simulator** — generates realistic sensor data every second to stand in for a real PLC, designed to be swapped for a real Modbus TCP / OPC UA connection later

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router (nested routes), Recharts, Axios, Socket.io-client |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcrypt, RBAC middleware |
| Deployment | Docker, Docker Compose, Nginx |
| Industrial protocols | Modbus TCP, OPC UA *(planned)* |

---

## Project structure

```
plc-dashboard/
├── docker-compose.yaml
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
│       ├── server.js
│       ├── config/          # db connection, seed script
│       ├── models/          # User, Machine, SensorData, Alarm
│       ├── controllers/     # route logic
│       ├── routes/          # API endpoints
│       ├── middleware/      # JWT auth, RBAC
│       └── services/        # PLC simulator
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── .dockerignore
    └── src/
        ├── api/              # axios instance
        ├── socket/           # socket.io client
        ├── context/          # auth context
        ├── pages/            # Login, Dashboard (layout), DashboardPage,
        │                     # MonitorPage, AlarmsPage, HistoricalPage, UsersPage
        ├── components/       # Sidebar, Topbar, ProtectedRoute
        └── hooks/            # usePLCData
```

Dashboard pages are nested routes under `/dashboard` rendered through a shared layout (`Dashboard.jsx`) using React Router's `<Outlet />`, so each page has its own URL (`/dashboard/alarms`, `/dashboard/historical`, etc.) and survives a page refresh.

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB instance)

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Seed the database with the three demo machines:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Demo credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | admin123 |
| Operator | operator@example.com | op123 |

*(Register your own users via the Register page, or seed them directly in MongoDB.)*

---

## Running with Docker

The whole stack (backend + frontend) can also run via Docker Compose. MongoDB stays on Atlas (cloud), so only the connection string is needed in `backend/.env`.

```bash
docker-compose up --build
```

This builds and starts:
- **backend** — Node.js/Express API + Socket.io on port `5000`
- **frontend** — production React build served by Nginx on port `5173`

The app is available at `http://localhost:5173`. Nginx is configured with a SPA fallback (`try_files ... /index.html`) so React Router routes survive a direct refresh.

---

## API overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a new account |
| POST | `/api/auth/login` | Public | Authenticate and receive a JWT |
| POST | `/api/auth/forgot-password` | Public | Request a password reset token |
| POST | `/api/auth/reset-password/:token` | Public | Reset password with a valid token |
| GET | `/api/machines` | Authenticated | List all machines |
| GET | `/api/machines/:id` | Authenticated | Get a single machine |
| PATCH | `/api/machines/:id/status` | Admin | Update machine status |
| GET | `/api/alarms` | Authenticated | List all alarms |
| PATCH | `/api/alarms/:id/acknowledge` | Authenticated | Acknowledge an alarm |
| GET | `/api/historical/:machineId` | Authenticated | Last 60 sensor readings for a machine |
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Create a user |
| DELETE | `/api/users/:id` | Admin | Delete a user |

**Socket.io events**
- `sensor_update` — emitted every second with live sensor readings per machine
- `new_alarm` — emitted when a new alarm is generated

---

## Roadmap

- [x] Backend API with JWT auth and RBAC
- [x] PLC data simulator with Socket.io broadcast
- [x] All six dashboard pages
- [x] Nested routing (each page has its own URL)
- [x] Dockerize frontend and backend with Docker Compose
- [ ] Deploy to a live URL (Render / Railway / VPS + Nginx reverse proxy)
- [ ] Real PLC integration via Modbus TCP (Mitsubishi, Siemens, Allen-Bradley)
- [ ] OPC UA support

---

## License

MIT