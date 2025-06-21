import {
  usersDb
} from './db';
import { v4 as uuidv4 } from 'uuid';

export const auth = {
  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      usersDb.findOne({
        username
      }, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  },

  async createUser(userData) {
    return new Promise((resolve, reject) => {
      // Add _id ONLY for new users
      usersDb.insert({
        ...userData,
        _id: uuidv4()
      }, (err, newDoc) => {
        if (err) return reject(err);
        resolve(newDoc);
      });
    });
  },

  async updateUser(username, updateData) {
    return new Promise((resolve, reject) => {
      // REMOVE _id assignment here - keep existing _id
      usersDb.update({
          username
        }, {
          $set: updateData
        }, {
          returnUpdatedDocs: true,
          multi: false
        },
        (err, numAffected, affectedDocuments) => {
          if (err) return reject(err);
          if (numAffected === 0) resolve(null);
          else resolve(affectedDocuments);
        }
      );
    });
  }
}
export async function getCurrentUser(req) {
  const authHeader = req.headers['x-auth-user'];
  if (!authHeader) return null;

  try {
    return JSON.parse(authHeader);
  } catch {
    return null;
  }
}