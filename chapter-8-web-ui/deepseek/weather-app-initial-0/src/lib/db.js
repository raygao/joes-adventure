import Datastore from "@seald-io/nedb";
import { v4 as uuidv4 } from 'uuid';

export const usersDb = new Datastore({ filename: "weather-users.db", autoload: true });
export const historyDb = new Datastore({ filename: "weather-history.db", autoload: true });

export async function logRequest(username, city, latitude, longitude, days) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString();
    const id = uuidv4();
    
    historyDb.insert({ 
      id,
      username, 
      city, 
      latitude, 
      longitude, 
      days, 
      timestamp 
    }, (err, newDoc) => {
      if (err) reject(err);
      else resolve(newDoc);
    });
  });
}

export async function getHistoryByUser(username) {
  return new Promise((resolve, reject) => {
    historyDb.find({ username })
      .sort({ timestamp: -1 })
      .exec((err, history) => {
        if (err) reject(err);
        else resolve(history);
      });
  });
}

export async function updateUser(username, updateData) {
  return new Promise((resolve, reject) => {
    usersDb.update(
      { username },
      { $set: updateData },
      {},
      (err, numUpdated) => {
        if (err) reject(err);
        else resolve(numUpdated);
      }
    );
  });
}