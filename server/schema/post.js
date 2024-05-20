const typeDefs = `#graphql
    type Post {
          _id: ID
          content: String
          tags: [String]
          imgUrl: String
          authorId: String
          comments: [Comments]
          likes: [Likes] 
          createdAt: String
          updatedAt: String
          author: Author
      }

      type Author{
        username: String
        image_url: String
      }

      type Comments{
        content: String
        username: String
        image_url: String
        createdAt: String
        updatedAt: String
      }

      type Likes{
        username: String
        image_url: String
        createdAt: String
        updatedAt: String
      }

      type Query {
        getPost: [Post]
        getPostById(_id: ID): Post
      }

      input postData{
        content: String!
        tags: [String]
        imgUrl: String
      }

      input postComment{
        postId: String
        content: String
      }

      input likePost{
        postId: String
      }

      type Mutation{
        addPost(data: postData): Post
        postComment(data: postComment): Post
        likePost(data: likePost):Post
      }

`;

module.exports = typeDefs;
