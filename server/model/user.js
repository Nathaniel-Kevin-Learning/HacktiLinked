const { ObjectId } = require('mongodb');
const { database } = require('../config/mongodb');

class User {
  static collection() {
    return database.collection('Users');
  }
  static async getUser() {
    return this.collection().find().toArray();
  }

  static async getUserById(_id) {
    return this.collection().findOne({
      _id: new ObjectId(String(_id)),
    });
  }

  static async getUserByNameOrUsername(nameOrUsername) {
    return this.collection()
      .find({
        $or: [
          { name: { $regex: nameOrUsername, $options: 'i' } },
          { username: { $regex: nameOrUsername, $options: 'i' } },
        ],
      })
      .toArray();
  }

  static async registerNewUser(data) {
    const { name, username, image_url, email, newPassword } = data;
    return this.collection().insertOne({
      name,
      username,
      image_url,
      email,
      password: newPassword,
    });
  }
}
module.exports = User;
