const User = require('../model/user');
const { GraphQLError } = require('graphql');
const { encryptPassword, checkEncrypt } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

const resolvers = {
  Query: {
    getUser: async () => {
      const data = await User.getUser();
      return data;
    },

    getCurrentUser: async (_, args, contextValue) => {
      const headers = contextValue.authentication();
      const _id = headers._id;
      const result = await User.getUserById(_id);
      return result;
    },

    searchUserById: async (_, args, contextValue) => {
      contextValue.authentication();
      const { _id } = args;
      const result = await User.getUserById(_id);
      if (!result) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'BAD_REQUEST',
          },
        });
      }
      return result;
    },

    searchUserByNameOrUsername: async (_, args, contextValue) => {
      contextValue.authentication();
      const { nameOrUsername } = args;
      const result = await User.getUserByNameOrUsername(nameOrUsername);

      return result;
    },
  },

  Mutation: {
    register: async (_, args) => {
      const { username, email, password, image_url } = args.newUser;
      let { name } = args.newUser;

      if (!username || username == '') {
        throw new GraphQLError('username is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!image_url || image_url == '') {
        throw new GraphQLError('Image url is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!email || email == '') {
        throw new GraphQLError('email is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      }

      if (!validateEmail(email)) {
        throw new GraphQLError('email is needed to be email format', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!password || password == '') {
        throw new GraphQLError('password is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (password.length < 5) {
        throw new GraphQLError('password length minimal is 5 word', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const dataUser = await User.getUser();
      let checker = false;
      let checker2 = false;
      dataUser.forEach((element) => {
        if (element.email == email) {
          checker = true;
        }
        if (element.username == username) {
          checker2 = true;
        }
      });

      if (checker2) {
        throw new GraphQLError('username must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
      if (checker) {
        throw new GraphQLError('email must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (password.length < 5) {
        throw new GraphQLError('password length minimal 5', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      let newPassword = encryptPassword(password);

      if (!name) {
        name = '';
      }

      const data = await User.registerNewUser({
        name,
        username,
        image_url,
        email,
        newPassword,
      });

      const result = await User.getUserById(data.insertedId);
      return result;
    },

    login: async (_, args) => {
      const { email, password } = args.loginData;

      if (!email || email == '') {
        throw new GraphQLError('email is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      }

      if (!validateEmail(email)) {
        throw new GraphQLError('email is needed to be email format', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!password || password == '') {
        throw new GraphQLError('password is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const dataUser = await User.getUser();
      let data = dataUser.find((element) => {
        if (element.email == email) {
          return element;
        }
      });

      if (!data) {
        throw new GraphQLError('email or password is incorrect', {
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
          },
        });
      }

      let passwordChecker = checkEncrypt(password, data.password);
      if (!passwordChecker) {
        throw new GraphQLError('email or password is incorrect', {
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
          },
        });
      }

      let payload = {
        _id: data._id,
      };

      let access_token = signToken(payload);

      return { access_token };
    },
  },
};

module.exports = resolvers;
