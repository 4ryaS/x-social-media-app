export const queries =  `#graphql
    verify_google_token(token: String!): String
    get_current_user: User
    get_user_by_id(id: ID!): User
`;