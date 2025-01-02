import axios from "axios";
import { prisma_client } from "../../clients/db";
import JWTService from "../../services/jwt";
import { GraphQLContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";

const queries = {
    verify_google_token: async (parent: any, { token }: { token: string }) => {
        const auth_token = await UserService.verify_google_auth_token(token);
        return auth_token;

    },
    get_current_user: async (parent: any, args: any, ctx: GraphQLContext) => {
        const id = ctx.user?.id;
        if (!id) return null;

        const user = await UserService.get_user_by_id(id);
        return user;
    },
    get_user_by_id: async (parent: any, { id }: { id: string }, ctx: GraphQLContext) => {
        return UserService.get_user_by_id(id);
    }
};

const posts_resolvers = {
    User: {
        posts: (parent: User) => {
            const posts = prisma_client.post.findMany({ where: { author: { id: parent.id } } });
            return posts;
        }
    }
};

export const resolvers = { queries, posts_resolvers };