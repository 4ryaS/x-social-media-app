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

export const get_signed_url_for_post_query = graphql(`#graphql
    query GetSignedURL($image_name: String!, $image_type: String!) {
        get_signed_url_for_post(image_name: $image_name, image_type: $image_type)
    }
`);