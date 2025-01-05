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

        posts: [Post]
    }
`;