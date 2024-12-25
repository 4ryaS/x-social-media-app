import { graphql } from "@/gql";

export const create_post_mutation = graphql(`#graphql
    
    mutation CreatePost($payload: CreatePostData) {
        create_post(payload: $payload) {
            id
        }
    }
`);