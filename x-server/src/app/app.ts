import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prisma_client } from "../clients/db";

import { User } from "./user";

export async function init_server() {
    const app = express();
    
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))

    const graphql_server = new ApolloServer({
        typeDefs: `
            ${User.types}
            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
        },
    });

    await graphql_server.start(); 

    app.use('/graphql', expressMiddleware(graphql_server));

    return app;
}