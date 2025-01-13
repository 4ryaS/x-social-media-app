import { graphql } from "@/gql";

export const follow_user_mutation = graphql(`
    #graphql
    mutation follow_user($to: ID!) {
        follow_user(to: $to)
    }
`);

export const unfollow_user_mutation = graphql(`
    #graphql
    mutation unfollow_user($to: ID!) {
        unfollow_user(to: $to)
    }
`);

export const like_post_mutation = graphql(`
    #graphql
    mutation like_post($post_id: ID!) {
        like_post(post_id: $post_id)
    }
`);

export const unlike_post_mutation = graphql(`
    #graphql
    mutation unlike_post($post_id: ID!) {
        unlike_post(post_id: $post_id)
    }
`);