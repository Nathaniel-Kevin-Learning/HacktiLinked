if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const userTypeDefs = require('./schema/user');
const userResolver = require('./resolver/user');
const postTypeDefs = require('./schema/post');
const postResolver = require('./resolver/post');
const followTypeDefs = require('./schema/follow');
const followResolver = require('./resolver/follow');
const { GraphQLError } = require('graphql');
const { verifyToken } = require('./helpers/jwt');
const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolver, postResolver, followResolver],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: ({ req }) => {
    return {
      authentication: () => {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || authorizationHeader == '') {
          throw new GraphQLError('Access token is invalid', {
            extensions: { code: 'NOT_AUTHORIZED' },
          });
        }
        const bearer = authorizationHeader.split(' ')[0];
        if (bearer != 'Bearer') {
          throw new GraphQLError('Access token is invalid', {
            extensions: { code: 'NOT_AUTHORIZED' },
          });
        }
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
          throw new GraphQLError('Access token is invalid', {
            extensions: { code: 'NOT_AUTHORIZED' },
          });
        }

        const decodeToken = verifyToken(token);
        if (!decodeToken) {
          throw new GraphQLError('Access token is invalid', {
            extensions: { code: 'NOT_AUTHORIZED' },
          });
        }
        return decodeToken;
      },
    };
  },
})
  .then(({ url }) => {
    console.log('Server ready at ' + url);
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });
