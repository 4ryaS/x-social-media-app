export const types = `#graphql

    type User {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        profile_img_url: String

        followers: [User]
        following: [User]

        recommend_users: [User]

        likes: [Likes]
        
        posts: [Post]
    }

    type Likes {
        user: User!
        user_id: String!
        post: Post!
        post_id: String!
        like_time: String!
    }
`;