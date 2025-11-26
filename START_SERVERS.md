# How to Start Both Servers

## Quick Start

### Option 1: Use Startup Scripts

**Windows Command Prompt:**
```bash
start-dev.bat
```

**PowerShell:**
```bash
powershell -ExecutionPolicy Bypass -File start-dev.ps1
```

### Option 2: Manual Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Verify Servers Are Running

- **Backend**: http://localhost:4000/api/health
- **Frontend**: http://localhost:5173

## Troubleshooting

### Backend Not Starting
1. Check if port 4000 is already in use
2. Make sure `.env` file exists in `backend/` folder
3. Run `npm install` in `backend/` folder

### Frontend Not Starting
1. Check if port 5173 is already in use
2. Run `npm install` in `frontend/` folder
3. Make sure backend is running first

### Dependencies Not Installed
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Default Credentials

- **Admin**: admin@gmail.com / 12345
- **User**: user@gmail.com / 12345

