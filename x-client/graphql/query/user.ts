import { graphql } from "../../gql"

export const verify_user_google_token = graphql(`#graphql
    query VerifyUserGoogleToken($token: String!) {
        verify_google_token(token: $token)
    }
`);