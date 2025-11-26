import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (filename) => path.join(DATA_DIR, filename);

export const readData = (filename, defaultValue = []) => {
  const filePath = getFilePath(filename);
  
  if (!fs.existsSync(filePath)) {
    writeData(filename, defaultValue);
    return defaultValue;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
};

export const writeData = (filename, data) => {
  const filePath = getFilePath(filename);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

export const findById = (filename, id) => {
  const data = readData(filename);
  return data.find(item => item.id === id);
};

export const findIndex = (filename, id) => {
  const data = readData(filename);
  return data.findIndex(item => item.id === id);
};

export const create = (filename, item) => {
  const data = readData(filename);
  data.push(item);
  writeData(filename, data);
  return item;
};

export const update = (filename, id, updates) => {
  const data = readData(filename);
  const index = data.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  data[index] = { ...data[index], ...updates };
  writeData(filename, data);
  return data[index];
};

export const remove = (filename, id) => {
  const data = readData(filename);
  const filtered = data.filter(item => item.id !== id);
  
  if (filtered.length === data.length) {
    return null; // Item not found
  }
  
  writeData(filename, filtered);
  return true;
};

