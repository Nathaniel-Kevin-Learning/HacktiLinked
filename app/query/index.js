import { gql } from '@apollo/client';

export const GET_POST = gql`
  query getAllPost {
    getPost {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
      author {
        username
        image_url
      }
      comments {
        content
        username
        createdAt
        updatedAt
        image_url
      }
      likes {
        username
        createdAt
        updatedAt
        image_url
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      _id
      name
      username
      email
      image_url
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID) {
    getPostById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        image_url
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
        image_url
      }
      createdAt
      updatedAt
      author {
        username
        image_url
      }
    }
  }
`;

export const USER_DATA = gql`
  query SearchUserById($id: ID) {
    searchUserById(_id: $id) {
      _id
      name
      username
      email
      image_url
    }
    getFollower(_id: $id) {
      _id
      followingId
      followerId
      follower {
        username
        image_url
      }
    }
    getFollowing(_id: $id) {
      _id
      followingId
      followerId
      following {
        username
        image_url
      }
    }
  }
`;

export const SEARCH_NAME_OR_USERNAME = gql`
  query getUserByNameOrUsername($nameOrUsername: String) {
    searchUserByNameOrUsername(nameOrUsername: $nameOrUsername) {
      _id
      name
      username
      email
      image_url
    }
  }
`;
