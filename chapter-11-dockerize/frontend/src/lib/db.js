import Datastore from "@seald-io/nedb";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { dbinit } from './db-init.js';

// Create proper file paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../db');

// Ensure database directory exists (with enhanced logging)
console.log(`Ensuring database directory exists at: ${dbPath}`);
dbinit(dbPath);

// Database configurations
const dbConfig = {
  autoload: true,
  timestampData: true,
  onload: function(err) {
    if (err) {
      console.error('Database load error:', err);
      const dir = path.dirname(this.filename);
      if (!fs.existsSync(dir)) {
        console.log(`Creating missing directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(this.filename)) {
        console.log(`Creating new database file: ${this.filename}`);
        fs.writeFileSync(this.filename, '[]', 'utf-8');
        this.loadDatabase();
      }
    }
  }
};

// Initialize databases
export const usersDb = new Datastore({
  filename: path.join(dbPath, 'weather-users.db'),
  ...dbConfig
});

export const historyDb = new Datastore({
  filename: path.join(dbPath, 'weather-history.db'),
  ...dbConfig
});

// Initialize databases with error handling
export async function initializeDatabases() {
  try {
    await new Promise((resolve, reject) => {
      usersDb.loadDatabase((err) => err ? reject(err) : resolve());
    });
    
    await new Promise((resolve, reject) => {
      historyDb.loadDatabase((err) => err ? reject(err) : resolve());
    });
    
    console.log('Databases initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err);
    [usersDb.filename, historyDb.filename].forEach(file => {
      if (!fs.existsSync(file)) {
        console.log(`Creating empty database: ${file}`);
        fs.writeFileSync(file, '[]', 'utf-8');
      }
    });
    throw err;
  }

  // Add unique index on username to prevent duplicates
  usersDb.ensureIndex({ fieldName: 'username', unique: true }, (err) => {
    if (err) {
      console.error('Error creating username index:', err);
    } else {
      console.log('Username unique index created successfully');
    }
  });
}

// History operations
export async function logRequest(username, city, latitude, longitude, days) {
  return new Promise((resolve, reject) => {
    historyDb.insert(
      {
        id: uuidv4(),
        username,
        city,
        latitude,
        longitude,
        days,
        timestamp: new Date()
      },
      (err, newDoc) => err ? reject(err) : resolve(newDoc)
    );
  });
}

export async function getHistoryByUser(username) {
  return new Promise((resolve, reject) => {
    historyDb.find({ username })
      .sort({ timestamp: -1 })
      .exec((err, history) => {
        if (err) return reject(err);
        resolve(history);
      });
  });
}

// Initialize databases on import
initializeDatabases().catch(err => {
  console.error('Critical database initialization error:', err);
  console.log('Attempting to continue with empty databases');
});