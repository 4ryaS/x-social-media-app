import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { prisma_client } from "../clients/db";

import { User } from "./user";

export async function init_server() {
    const app = express();
    
    app.use(express.json());
    // app.use(express.urlencoded({extended: true}))
    const cors_options = {
        origin: 'http://localhost:3000', // Allow requests from localhost:3000
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    };
    app.use(cors(cors_options));
    // app.use(cors()); 

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