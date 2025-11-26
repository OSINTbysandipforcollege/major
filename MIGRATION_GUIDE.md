# Migration Guide - Separating Frontend and Backend

The project has been reorganized into separate frontend and backend folders.

## New Structure

```
ResQ/
├── frontend/          # React frontend (standalone)
├── backend/           # Express backend (standalone)
└── [old files]       # Can be removed after migration
```

## What Was Done

1. ✅ Created `frontend/` folder with clean package.json (frontend dependencies only)
2. ✅ Created `backend/` folder with backend API
3. ✅ Copied all frontend source files to `frontend/src/`
4. ✅ Copied public assets to `frontend/public/`
5. ✅ Created separate README files for each project

## Next Steps

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend

Create `backend/.env`:
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-here
```

### 4. Start Development

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

## Cleanup (Optional)

After verifying everything works, you can remove:
- Old `server/` folder (replaced by `backend/`)
- Old root-level config files (now in `frontend/`)
- Old `package.json` in root (replaced by `frontend/package.json`)

## Verification

1. Backend should start on `http://localhost:4000`
2. Frontend should start on `http://localhost:5173`
3. Login with `admin@gmail.com` / `12345`
4. Create an event in Admin Dashboard
5. Logout and login as `user@gmail.com` / `12345`
6. View events and register for one

If everything works, the migration is complete! 🎉

