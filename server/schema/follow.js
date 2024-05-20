const typeDefs = `#graphql

    type Follow{
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
        follower: Follower
        following: Following
    }
    
    type Follower{
        username: String
        image_url: String
    }

    type Following{
        username: String
        image_url: String
    }

    type Query{
        getFollower(_id: ID): [Follow]
        getFollowing(_id: ID): [Follow]
    }

    input followData{
        followingId: String
    }

    type Mutation{
        followUser(data: followData): Follow        
    }
`;

module.exports = typeDefs;
