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