export const mutations = `#graphql
    create_post(payload: CreatePostData): Post
    delete_post(post_id: ID!): Post
`