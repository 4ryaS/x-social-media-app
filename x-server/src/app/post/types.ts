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

    # type Likes {
    #     user: User!
    #     user_id: String!
    #     post: Post!
    #     post_id: String!
    #     like_time: String!
    # }

    # type Repost {
    #     id: String!
    #     post: Post!
    #     author: User!
    #     created_at: String!
    # }

    type Mutation {
        create_post(payload: CreatePostData): Post
    }

`