import { GraphQLClient } from "graphql-request";

const is_client = typeof window !== "undefined";

export const graphql_client = new GraphQLClient("http://127.0.0.1:8000/graphql", {
    headers: () => ({
        Authorization: is_client ? `Bearer ${window.localStorage.getItem("x_token")}` : "",
    })
});