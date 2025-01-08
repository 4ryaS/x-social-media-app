export const mutations = `#graphql
    follow_user(to: ID!): Boolean
    unfollow_user(to: ID!): Boolean

    like_post(post_id: ID!): Boolean
    unlike_post(post_id: ID!): Boolean
`;