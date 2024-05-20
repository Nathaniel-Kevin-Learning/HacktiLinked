const { GraphQLError } = require('graphql');
const Post = require('../model/post');
const User = require('../model/user');
const redis = require('../config/redis');

const resolvers = {
  Query: {
    getPost: async (_, args, contextValue) => {
      contextValue.authentication();
      //part redis
      let posts = await redis.get('posts');
      if (posts) {
        return JSON.parse(posts);
      }
      let data = await Post.getAllPost();
      await redis.set('posts', JSON.stringify(data));

      return data;
    },

    getPostById: async (_, args, contextValue) => {
      contextValue.authentication();
      const { _id } = args;
      let data = await Post.getPostById(_id);
      if (!data) {
        throw new GraphQLError('Data not found', {
          extensions: {
            code: 'BAD_REQUEST',
          },
        });
      }
      return data;
    },
  },
  Mutation: {
    addPost: async (_, args, contextValue) => {
      const { content, tags, imgUrl } = args.data;
      const header = contextValue.authentication();

      const currentUserId = header._id;
      if (content == '' || !content) {
        throw new GraphQLError('content is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (currentUserId == '' || !currentUserId) {
        throw new GraphQLError('authorId is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      let data = await Post.addPost({
        content,
        tags,
        imgUrl,
        createdAt,
        updatedAt,
        authorId: currentUserId,
      });
      await redis.del('posts');
      let result = await Post.getPostById(data.insertedId);
      return result;
    },

    postComment: async (_, args, contextValue) => {
      const { postId, content } = args.data;
      const header = contextValue.authentication();

      const currentUserId = header._id;
      const currentUser = await User.getUserById(currentUserId);

      if (content == '' || !content) {
        throw new GraphQLError('comment content is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      //data user
      const username = currentUser.username;

      if (username == '' || !username) {
        throw new GraphQLError('username is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const image_url = currentUser.image_url;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      await Post.addComment(postId, {
        content,
        username,
        image_url,
        createdAt,
        updatedAt,
      });
      await redis.del('posts');
      const result = await Post.getPostById(postId);
      console.log(result);
      return result;
    },

    likePost: async (_, args, contextValue) => {
      const { postId } = args.data;

      const header = contextValue.authentication();

      const currentUserId = header._id;
      const currentUser = await User.getUserById(currentUserId);

      //data user
      const username = currentUser.username;
      if (username == '' || !username) {
        throw new GraphQLError('username is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      const image_url = currentUser.image_url;

      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const checkData = await Post.getPostById(postId);
      let checker = false;

      checkData.likes.forEach((element) => {
        if (element.username == username) {
          checker = true;
        }
      });

      if (checker) {
        // throw new GraphQLError('User can only like post one time', {
        //   extensions: {
        //     code: 'BAD_USER_INPUT',
        //   },
        // });
        await Post.dislike(postId, { createdAt, updatedAt, username });
      } else {
        await Post.addLike(postId, {
          username,
          image_url,
          createdAt,
          updatedAt,
        });
      }
      await redis.del('posts');
      const result = await Post.getPostById(postId);
      return result;
    },
  },
};

module.exports = resolvers;
