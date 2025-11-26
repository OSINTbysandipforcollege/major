# ResQ Frontend

React + TypeScript + Vite frontend for ResQConnect Disaster Management System.

## Features

- 🔐 Authentication (Login/Register) with User/Admin roles
- 📅 Event Management (Admin)
- ✍️ Event Registration (Users)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional, defaults to `http://localhost:4000/api`):
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── context/       # React context (Auth)
│   ├── services/      # API service functions
│   ├── models/        # TypeScript interfaces
│   └── hooks/         # Custom React hooks
├── public/            # Static assets
└── package.json       # Dependencies
```

## API Configuration

The frontend connects to the backend API. Make sure the backend is running on `http://localhost:4000` or update the `VITE_API_URL` in `.env`.

## Default Credentials

- **Admin**: admin@gmail.com / 12345
- **User**: user@gmail.com / 12345

