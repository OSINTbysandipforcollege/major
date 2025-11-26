# ResQConnect - Disaster Management System

A full-stack disaster management platform with separate frontend and backend applications.

## 📁 Project Structure

```
ResQ/
├── frontend/          # React + TypeScript frontend (standalone)
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
│
├── backend/          # Express.js backend API (standalone)
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   ├── utils/       # Database utilities
│   └── package.json # Backend dependencies
│
├── start-dev.bat    # Windows script to start both servers
├── start-dev.ps1    # PowerShell script to start both servers
└── README.md        # This file
```

## 🚀 Quick Start

### Option 1: Use Startup Scripts (Easiest)

**Windows:**
```bash
start-dev.bat
```

**PowerShell:**
```bash
powershell -ExecutionPolicy Bypass -File start-dev.ps1
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Configuration

### Backend Setup

1. Navigate to `backend/` folder
2. Create `.env` file:
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend Setup

The frontend automatically connects to `http://localhost:4000/api`. To change this, create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:4000/api
```

## ✨ Features

### Authentication
- ✅ User/Admin login and registration
- ✅ JWT token-based authentication
- ✅ Protected routes with role-based access

### Event Management
- ✅ Admin can create/update/delete events
- ✅ Events displayed on Events page
- ✅ Mark events as completed/upcoming

### Event Registration
- ✅ Users can register for upcoming events
- ✅ Registration status saved in database
- ✅ Users can cancel registrations
- ✅ View all registered events

## 🔑 Default Credentials

- **Admin**: `admin@gmail.com` / `12345`
- **User**: `user@gmail.com` / `12345`

## 📚 Documentation

- **Frontend**: See `frontend/README.md` for frontend setup and usage
- **Backend**: See `backend/README.md` for API documentation
- **Migration**: See `MIGRATION_GUIDE.md` for migration details

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- JSON file database (easily migratable to MongoDB/PostgreSQL)

## 📝 Development

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev  # Auto-reload on changes
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev  # Hot module replacement
```

## 🧪 Testing

1. Start both servers
2. Open `http://localhost:5173`
3. Login as Admin: `admin@gmail.com` / `12345`
4. Create an event in Admin Dashboard → Events
5. Logout and login as User: `user@gmail.com` / `12345`
6. Go to Events page and register for an event
7. Check registration status

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
```
Output: `frontend/dist/`

### Backend
```bash
cd backend
npm start
```
Runs on port 4000 (or PORT from .env)

## 📄 License

MIT
