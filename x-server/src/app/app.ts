import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { prisma_client } from "../clients/db";

import { User } from "./user";
import { GraphQLContext } from "../interfaces";
import JWTService from "../services/jwt";

export async function init_server() {
    const app = express();
    
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    // const cors_options = {
    //     origin: 'http://localhost:3000', // Allow requests from localhost:3000
    //     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    //     allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    // };
    // app.use(cors(cors_options));

    const graphql_server = new ApolloServer<GraphQLContext>({
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

    app.use('/graphql', expressMiddleware(graphql_server, {
        context: async ({ req, res }) => {
            // console.log(req.headers.authorization);
            return {
                user: req.headers.authorization ? JWTService.decode_token(req.headers.authorization.split("Bearer ")[1] as string): undefined,
            }
        }
    }));

    return app;
}