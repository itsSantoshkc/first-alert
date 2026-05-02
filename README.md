# FirstAlert / RespondNow — Emergency Response Platform

A real-time emergency response application that connects citizens in distress with nearby first responders (Police, Fire Fighters, Medics). Built with **React + Vite** on the frontend and **NestJS** on the backend.

---

## Screenshots

### User Sending Alert
![User Sending Alert](docs/images/user_sending_alert.jpeg)

### Alert Request to Respondent
![Alert Request to Respondent](docs/images/user_sending_alert.jpeg)

### Routing on Both User and Respondent
![Routing on Both User and Respondent](docs/images/routing_on_both_user_and_respondent.jpeg)

---

## Tech Stack

### Frontend
- **React** + **Vite** (TypeScript)
- **React Leaflet** + **Leaflet Routing Machine** — interactive map with live routing
- **Socket.IO Client** — real-time alert and location updates
- **TanStack Query** — server state and mutations
- **Zod** — schema validation
- **Sonner** — toast notifications

### Backend
- **NestJS** — modular backend framework
- **Prisma** — ORM for database access
- **Redis** — geospatial search for finding nearby responders
- **Passport.js + JWT** — authentication and route guards
- **Socket.IO** — real-time bidirectional communication

---

## Features


*   **Emergency Alert System** – Enables citizens to request immediate assistance from medical, police, or fire departments through a centralized interface.
*   **Real-Time Dispatch Integration** – Leverages Socket.IO for instantaneous, low-latency alert broadcasting to all available responders.
*   **Interactive Response Management** – Provides responders with actionable toast notifications to efficiently accept or decline incoming emergency requests.
*   **Automated Live Routing** – Dynamically renders optimal navigational routes on an interactive map from the responder’s current location to the incident site.
*   **Geospatial Tracking** – Implements a continuous 7-second polling interval to emit responder coordinates to the server during active missions.
*   **Secure JWT Authentication** – Ensures robust session security using an access token and `httpOnly` refresh token cookie workflow.

---

## Project Structure

```
├── user-frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── Auth/                         # Contains Login,Register page
│   │   ├── components/   
│   │   │   ├── Map.tsx                   # Leaflet map wrapper
│   │   │   ├── ui/                       # ShadCn componentes
│   │   │   └── RoutingMachine.tsx        # Leaflet routing with custom icons
│   │   ├── contexts/   
│   │   │   └── AuthContext.tsx           # Auth state (user, tokens)
│   │   ├── lib/    
│   │   │   └── socket.ts                 # Socket.IO client instance
│   │   │   └── utils.ts                  # Tailwind Merge
│   │   ├── Respondent/
│   │   │   └── components/               # Compnentes used for respondent
│   │   │   └── hooks/                    # Compnentes used for respondent
│   │   │   │   └── useAlertSocket.tsx    # Compnentes used for respondent
│   │   │   │   └── useLocationSync.tsx   # Compnentes used for respondent
│   │   │   └── Homepage.tsx              # Socket.IO client instance
│   │   ├── User/   
│   │   │   └── components/               # Compnentes used for user
│   │   │   └── Pages/                    
│   │   │   └── Homepage.tsx              
│   │   ├── routes/                       # Tanstack router generated
│   │   ├── utilities/    
│   │   │   └── useFetchClient.ts         # Fetch wrapper with auth headers
│   │   │   └── RoutingMachine.tsx        # For routing purposes
│   │   │   └── jwtHelper.ts              # To decode jwt token
│   └── .env                              # VITE_SERVER_ADDRESS
│
└── user-backend/
    ├── src/
    │   ├── auth/                     # Signup, login, refresh token
    │   ├── alert/                    # Send and accept alerts
    │   └── location/                 # Live location updates + geo search
    │   └── user                      # User related stuff such as updating profie
    └── prisma/
        └── schema.prisma
```

---

## Environment Variables

### Frontend (`.env`)
```env
VITE_SERVER_ADDRESS=http://localhost:3000
```

### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/firstalert
REDIS_URL=redis://localhost:6379
```

---

## API Reference

### Auth — `/auth`

| Method | Endpoint        | Auth | Description                          |
|--------|-----------------|------|--------------------------------------|
| POST   | `/auth/signup`  | No   | Register a new user                  |
| POST   | `/auth/login`   | No   | Login, returns access + refresh token|
| POST   | `/auth/refresh` | No   | Refresh access token via cookie      |

**Tokens:** Access token returned in response body. Refresh token set as an `httpOnly` cookie (`maxAge: 7 days`).

---

### Alert — `/alert`

| Method | Endpoint             | Auth | Description                          |
|--------|----------------------|------|--------------------------------------|
| POST   | `/alert/send-alert`  | JWT  | Citizen sends an emergency alert     |
| PATCH  | `/alert/accept-alert`| JWT  | Responder accepts an incoming alert  |

**`POST /alert/send-alert` body:**
```json
{
  "alertType": "Medic | FireFighter | Police",
  "latitude": 27.6748,
  "longitude": 85.4274
}
```

**`PATCH /alert/accept-alert` body:**
```json
{
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9800000000"
  },
  "alertType": "Medic",
  "latitude": 27.6748,
  "longitude": 85.4274,
  "socketId": "abc123"
}
```

---

### Location — `/location`

| Method | Endpoint                        | Auth | Description                              |
|--------|---------------------------------|------|------------------------------------------|
| PATCH  | `/location/live-location`       | JWT  | Update responder's live location         |
| POST   | `/location/get-respondent-location` | No | Find responders near a given coordinate |

**`PATCH /location/live-location` body:**
```json
{
  "latitude": 27.6748,
  "longitude": 85.4274,
  "responderType": "Medic"
}
```

---

## Socket.IO Events

### Client → Server

| Event              | Payload                              | Description                           |
|--------------------|--------------------------------------|---------------------------------------|
| `join:activeAlert` | `{ alertId: string }`                | Join responder room on connect        |
| `alert:reject`     | `{ alertId: string, userId: string }`| Reject an incoming alert              |
| `location:update`  | `{ userId, latitude, longitude, responderType }` | Send live location every 7s |

### Server → Client

| Event              | Payload                              | Description                           |
|--------------------|--------------------------------------|---------------------------------------|
| `alert:Medic`      | Alert data                           | Alert dispatched to medics            |
| `alert:Police`     | Alert data                           | Alert dispatched to police            |
| `alert:FireFighter`| Alert data                           | Alert dispatched to fire fighters     |
| `location:update`  | `{ latitude, longitude }`            | Citizen receives responder location   |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Authentication Flow

1. User signs up or logs in → receives `accessToken` in response and `refreshToken` as an `httpOnly` cookie
2. All protected requests include `Authorization: Bearer <accessToken>` header
3. On expiry, call `POST /auth/refresh` — new tokens are issued automatically

---

## Live Location Flow

1. Responder accepts an alert → `isActivelyResponding` set to `true`
2. Every **7 seconds**, the frontend emits `location:update` via Socket.IO with the latest GPS coordinates
3. The citizen's map updates in real-time via the `location:update` socket event
4. Leaflet Routing Machine draws a live route from the responder to the citizen

---

