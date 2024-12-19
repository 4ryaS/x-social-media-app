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
        }
    }
`);