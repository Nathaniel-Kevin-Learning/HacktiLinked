const { ObjectId } = require('mongodb');
const { database } = require('../config/mongodb');

class Follow {
  static collection() {
    return database.collection('Follow');
  }

  static async getFollower(followingId) {
    return this.collection()
      .aggregate([
        {
          $match: {
            followingId: new ObjectId(String(followingId)),
          },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'followerId',
            foreignField: '_id',
            as: 'follower',
          },
        },
        {
          $unwind: {
            path: '$follower',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            'follower._id': 0,
            'follower.name': 0,
            'follower.password': 0,
            'follower.email': 0,
          },
        },
      ])
      .toArray();
  }

  static async getFollowing(followerId) {
    return this.collection()
      .aggregate([
        {
          $match: {
            followerId: new ObjectId(String(followerId)),
          },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'followingId',
            foreignField: '_id',
            as: 'following',
          },
        },
        {
          $unwind: {
            path: '$following',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            'following._id': 0,
            'following.name': 0,
            'following.password': 0,
            'following.email': 0,
          },
        },
      ])
      .toArray();
  }

  static async getFollowById(_id) {
    return this.collection().findOne({
      _id: new ObjectId(String(_id)),
    });
  }

  static async followUser(data) {
    return this.collection().insertOne({
      ...data,
      followingId: new ObjectId(String(data.followingId)),
      followerId: new ObjectId(String(data.followerId)),
    });
  }

  static async unFollowUser(data) {
    return this.collection().deleteOne({
      followingId: new ObjectId(String(data.followingId)),
      followerId: new ObjectId(String(data.followerId)),
    });
  }
}

module.exports = Follow;
