import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($loginData: UserLogin) {
    login(loginData: $loginData) {
      access_token
    }
  }
`;

export const REGISTER = gql`
  mutation register($newUser: UserRegist) {
    register(newUser: $newUser) {
      name
      username
      email
      _id
    }
  }
`;

export const LIKE_HOME = gql`
  mutation LikePost($data: likePost) {
    likePost(data: $data) {
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
        image_url
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($data: likePost) {
    likePost(data: $data) {
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
        image_url
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation PostComment($data: postComment) {
    postComment(data: $data) {
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
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($data: postData) {
    addPost(data: $data) {
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_FOLLOWING = gql`
  mutation FollowUser($data: followData) {
    followUser(data: $data) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;
