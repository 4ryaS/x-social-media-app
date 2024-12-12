import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prisma_client } from "../clients/db";

export async function init_server() {
    const app = express();
    
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))

    const graphql_server = new ApolloServer({
        typeDefs: `
            type Query {
                say_hello: String
            }
        `,
        resolvers: {
            Query: {
                say_hello: () => `Hello From GraphQL Server`
            },
        },
    });

    await graphql_server.start(); 

    app.use('/graphql', expressMiddleware(graphql_server));

    return app;
}