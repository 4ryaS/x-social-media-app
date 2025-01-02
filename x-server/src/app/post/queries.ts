export const queries = `#graphql
    get_all_posts: [Post]
    get_signed_url_for_post(image_name: String!, image_type: String!): String
`;