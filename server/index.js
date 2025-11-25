import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

const defaultUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    role: 'admin',
    password: '12345',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@gmail.com',
    role: 'user',
    password: '12345',
  },
];

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
};

const readUsers = () => {
  try {
    const fileContent = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read users file:', error);
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const normalizePasswords = () => {
  const users = readUsers();
  let mutated = false;

  const normalized = users.map((user) => {
    if (user.password && user.password.startsWith('$2')) {
      return user;
    }

    mutated = true;
    return {
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    };
  });

  if (mutated) {
    writeUsers(normalized);
  }
};

ensureDataFile();
normalizePasswords();

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

const buildToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1d' },
  );

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const getUserByEmail = (email) => readUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());

const verifyToken = (authHeader) => {
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const formatError = (message) => ({ message });

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json(formatError('Email and password are required.'));
  }

  const user = getUserByEmail(email);

  if (!user) {
    return res.status(401).json(formatError('Invalid credentials.'));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json(formatError('Invalid credentials.'));
  }

  const token = buildToken(user);

  return res.json({
    token,
    user: sanitizeUser(user),
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json(formatError('Name, email, and password are required.'));
  }

  if (getUserByEmail(email)) {
    return res.status(409).json(formatError('A user with that email already exists.'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: randomUUID(),
    name,
    email,
    role: 'user',
    password: hashedPassword,
  };

  const users = readUsers();
  users.push(newUser);
  writeUsers(users);

  const token = buildToken(newUser);

  return res.status(201).json({
    token,
    user: sanitizeUser(newUser),
  });
});

app.get('/api/auth/me', (req, res) => {
  const payload = verifyToken(req.headers.authorization);

  if (!payload) {
    return res.status(401).json(formatError('Invalid or expired token.'));
  }

  const users = readUsers();
  const user = users.find((entry) => entry.id === payload.sub);

  if (!user) {
    return res.status(404).json(formatError('User not found.'));
  }

  return res.json({
    user: sanitizeUser(user),
  });
});

app.post('/api/auth/logout', (_req, res) => {
  // With stateless JWT auth the client discards the token.
  return res.json({ message: 'Logged out successfully.' });
});

app.use((err, _req, res, _next) => {
  console.error('Unexpected error', err);
  res.status(500).json(formatError('Something went wrong. Please try again later.'));
});

app.listen(PORT, () => {
  console.log(`API server ready on http://localhost:${PORT}`);
});


