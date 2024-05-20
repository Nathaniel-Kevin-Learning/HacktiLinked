const { GraphQLError } = require('graphql');
const Follow = require('../model/follow');
const { Query } = require('./post');

const resolve = {
  Query: {
    getFollower: async (_, args, contextValue) => {
      contextValue.authentication();
      // const followingId = header._id;
      const followingId = args._id;

      let data = await Follow.getFollower(followingId);
      return data;
    },

    getFollowing: async (_, args, contextValue) => {
      contextValue.authentication();
      const followerId = args._id;

      let data = await Follow.getFollowing(followerId);
      return data;
    },
  },
  Mutation: {
    followUser: async (_, args, contextValue) => {
      const header = contextValue.authentication();
      const followerId = header._id;
      const { followingId } = args.data;

      if (followerId === followingId) {
        throw new GraphQLError('User cannot follow their own self', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let dataCheck = await Follow.getFollowing(followerId);
      let checker = false;
      // checking if user already follow this user
      dataCheck.forEach((element) => {
        if (element.followingId == followingId) {
          checker = true;
        }
      });

      if (checker) {
        // throw new GraphQLError('User already follow this person', {
        //   extensions: {
        //     code: 'BAD_USER_INPUT',
        //   },
        // });
        return await Follow.unFollowUser({ followingId, followerId });
      }

      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      let data = await Follow.followUser({
        followingId,
        followerId,
        createdAt,
        updatedAt,
      });

      let result = await Follow.getFollowById(data.insertedId);
      return result;
    },
  },
};

module.exports = resolve;
