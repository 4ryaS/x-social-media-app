export const types = `#graphql
    
    input CreatePostData {
        content: String!
        image_url: String
    }

    type Post {
        id: ID!
        content: String!
        image_url: String

        likes: [Likes]
        reposts: [Repost]

        author: User
    }

    type Mutation {
        create_post(payload: CreatePostData): Post
    }

`