# ResQ Backend API

Express.js backend API server for ResQConnect Disaster Management System.

## Features

- 🔐 JWT Authentication (Login/Register) with User/Admin roles
- 📅 Event CRUD operations (Admin only)
- ✍️ Event Registration system (Users)
- 💾 JSON-based database (easily migratable to real DB)
- 🔒 Protected routes with role-based access control

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user/admin
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout

### Events (`/api/events`)
- `GET /api/events` - Get all events (requires auth)
- `GET /api/events/:id` - Get single event (requires auth)
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Event Registrations (`/api/registrations`)
- `POST /api/registrations` - Register for an event (User)
- `GET /api/registrations/my-registrations` - Get user's registrations
- `GET /api/registrations/check/:eventId` - Check if registered
- `DELETE /api/registrations/:eventId` - Cancel registration
- `GET /api/registrations/event/:eventId` - Get all registrations for event (Admin)

## Database

Data is stored in JSON files in the `data/` directory:
- `users.json` - User accounts
- `events.json` - Events
- `registrations.json` - Event registrations

These files are automatically created on first run.

## Default Credentials

- **Admin**: admin@gmail.com / 12345
- **User**: user@gmail.com / 12345

## Project Structure

```
backend/
├── server.js              # Main server file
├── routes/                # API routes
│   ├── auth.js           # Authentication routes
│   ├── events.js         # Event CRUD routes
│   └── registrations.js  # Registration routes
├── middleware/            # Express middleware
│   └── auth.js           # JWT authentication
├── utils/                 # Utility functions
│   └── database.js       # JSON file database
└── data/                  # Auto-created JSON files
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```
