export const types = `#graphql

    type Repost {
        id: String!
        post: Post!
        author: User!
        created_at: String!
    }

    type Mutation {
        repost_post(post_id: String!): Post
        delete_repost(post_id: String!): Post
    }
`;