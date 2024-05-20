const typeDefs = `#graphql
      type User {
          _id: ID
          name: String
          username: String
          email: String
          password: String
          image_url: String
      }
  
      type UserCredential {
        access_token: String
      }

      type Query {
          getUser: [User]
          getCurrentUser: User
          searchUserById(_id: ID): User
          searchUserByNameOrUsername(nameOrUsername: String): [User]
      }


      input UserRegist {
        name: String
        username: String!
        email: String!
        password: String!
        image_url: String
      }

      input UserLogin{
        email:String!
        password:String!
      }

      type Mutation{
        register(newUser: UserRegist): User
        login(loginData: UserLogin): UserCredential
      }
  `;

module.exports = typeDefs;
