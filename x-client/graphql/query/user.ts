export const verify_user_google_token = `#graphql
    query VerifyUserGoogleToken($token: String!) {
        verify_google_token(token: $token)
    }
`;