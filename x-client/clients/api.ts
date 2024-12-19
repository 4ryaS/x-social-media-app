import { GraphQLClient } from "graphql-request";

// Check if the code is running in a browser
const isClient = typeof window !== "undefined";

// Create a GraphQL client with the authorization header conditionally based on environment
export const graphql_client = new GraphQLClient("http://localhost:8000/graphql", {
    headers: (): Record<string, string> => {
        // If in the client (browser), get the token from localStorage
        if (isClient) {
            const token = window.localStorage.getItem("x_token");
            return token ? { Authorization: `Bearer ${token}` } : {};
        }
        // If on the server, return an empty object or add your server-side logic for tokens
        return {};
    },
});
