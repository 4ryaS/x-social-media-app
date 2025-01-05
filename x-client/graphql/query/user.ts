import { graphql } from "../../gql"

export const verify_user_google_token = graphql(`#graphql
    query VerifyUserGoogleToken($token: String!) {
        verify_google_token(token: $token)
    }
`);

export const get_current_user_query = graphql(`#graphql
    query GetCurrentUser {
        get_current_user {
            id
            profile_img_url
            email
            first_name
            last_name
            followers {
                first_name
                last_name
                profile_img_url
                id
            }
            following {
                first_name
                last_name
                profile_img_url
                id
            }
            posts {
                id
                content
                author {
                    first_name
                    last_name
                    profile_img_url
                }
            }
        }
    }
`);

export const get_user_by_id_query = graphql(`#graphql
    query GetUserById($id: ID!) {
        get_user_by_id(id: $id) {
            id
            first_name
            last_name
            profile_img_url
            followers {
                first_name
                last_name
                profile_img_url
                id
            }
            following {
                first_name
                last_name
                profile_img_url
                id
            }
            posts {
                id
                content
                author {
                    first_name
                    last_name
                    profile_img_url
                }
            }
        }
    }
`);