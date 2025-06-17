import Datastore from "@seald-io/nedb";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Create proper file paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../db');

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Database configurations
const dbConfig = {
  autoload: true,
  timestampData: true,
  onload: (err) => {
    if (err) {
      console.error('Database load error:', err);
      // Create new database file if loading fails
      fs.writeFileSync(this.filename, '[]', 'utf-8');
      this.loadDatabase();
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
    throw err;
  }
}

// User operations
export async function createUser(userData) {
  return new Promise((resolve, reject) => {
    usersDb.insert(
      { ...userData, _id: uuidv4() },
      (err, newDoc) => err ? reject(err) : resolve(newDoc)
    );
  });
}

export async function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    usersDb.findOne({ username }, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

export async function updateUser(username, updateData) {
  return new Promise((resolve, reject) => {
    usersDb.update(
      { username },
      { $set: updateData },
      { returnUpdatedDocs: true },
      (err, numAffected, affectedDocuments) => {
        if (err) return reject(err);
        resolve(affectedDocuments);
      }
    );
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

// Database maintenance
export async function backupDatabase() {
  const backupPath = path.join(dbPath, 'backups');
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  try {
    await Promise.all([
      fs.promises.copyFile(
        path.join(dbPath, 'weather-users.db'),
        path.join(backupPath, `weather-users-${timestamp}.db`)
      ),
      fs.promises.copyFile(
        path.join(dbPath, 'weather-history.db'),
        path.join(backupPath, `weather-history-${timestamp}.db`)
      )
    ]);
    console.log('Database backup completed');
  } catch (err) {
    console.error('Backup failed:', err);
  }
}

// Initialize databases on import
initializeDatabases().catch(console.error);

// Backup every hour (optional)
setInterval(backupDatabase, 3600000);