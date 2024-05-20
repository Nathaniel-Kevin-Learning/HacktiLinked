const { ObjectId } = require('mongodb');
const { database } = require('../config/mongodb');

class Post {
  static collection() {
    return database.collection('Posts');
  }

  static async getAllPost() {
    return this.collection()
      .aggregate([
        {
          $lookup: {
            from: 'Users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            'author._id': 0,
            'author.email': 0,
            'author.name': 0,
            'author.password': 0,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray();
  }

  static async getPostById(_id) {
    const data = await this.collection()
      .aggregate([
        {
          $match: {
            _id: new ObjectId(String(_id)),
          },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            'author._id': 0,
            'author.email': 0,
            'author.name': 0,
            'author.password': 0,
          },
        },
      ])
      .toArray();

    return data[0];
  }

  static async addPost(data) {
    //  untuk sementara author masih di hard code
    return this.collection().insertOne({
      ...data,
      authorId: new ObjectId(String(data.authorId)),
      comments: [],
      likes: [],
    });
  }

  static async addComment(_id, data) {
    //  untuk sementara username masih hard code
    return this.collection().updateOne(
      { _id: new ObjectId(String(_id)) },
      { $push: { comments: { ...data } } }
    );
  }

  static async addLike(_id, data) {
    return this.collection().updateOne(
      { _id: new ObjectId(String(_id)) },
      { $push: { likes: data } }
    );
  }
  static async dislike(_id, data) {
    return this.collection().updateOne(
      { _id: new ObjectId(String(_id)) },
      {
        $pull: {
          likes: {
            username: data.username,
          },
        },
      }
    );
  }
}
module.exports = Post;
