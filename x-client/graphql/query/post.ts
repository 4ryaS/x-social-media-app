import { graphql } from "@/gql";

export const get_all_posts_query = graphql(`
    #graphql
    query GetAllTweets {
        get_all_posts {
            id
            content
            image_url
            author {
                id
                first_name
                last_name
                profile_img_url
            }
        }
    }
`);