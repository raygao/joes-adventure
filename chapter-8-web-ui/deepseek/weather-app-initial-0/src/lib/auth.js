import { usersDb } from './db';

export const auth = {
  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      usersDb.findOne({ username }, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
  },

  async createUser(userData) {
    return new Promise((resolve, reject) => {
      usersDb.insert(userData, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  },

  async updateUser(username, updateData) {
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
};