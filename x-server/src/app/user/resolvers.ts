import { GraphQLContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";
import { redis_client } from "../../clients/redis";

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

const mutations = {
    follow_user: async (parent: any, { to }: { to: string }, ctx: GraphQLContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
        await UserService.follow_user(ctx.user.id, to);
        await redis_client.del(`RECOMMENDED_USERS:${ctx.user.id}`);
        return true;
    },
    unfollow_user: async (parent: any, { to }: { to: string }, ctx: GraphQLContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
        await UserService.unfollow_user(ctx.user.id, to);
        await redis_client.del(`RECOMMENDED_USERS:${ctx.user.id}`);
        return true;
    },
    like_post: async (parent: any, { post_id }: { post_id: string }, ctx: GraphQLContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
        const post = await UserService.like_post(ctx.user.id, post_id);
        return post;
    },
    unlike_post: async (parent: any, { post_id }: { post_id: string }, ctx: GraphQLContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated!");
        const post = await UserService.unlike_post(ctx.user.id, post_id);
        return post;
    },
};

const user_resolvers = {
    User: {
        posts: async (parent: User) => {
            const posts = await UserService.get_user_posts(parent.id);
            return posts;
        },
        followers: async (parent: User) => {
            const followers = await UserService.get_followers(parent.id);
            return followers;
        },
        following: async (parent: User) => {
            const following = await UserService.get_following(parent.id);
            return following;
        },
        likes: async (parent: User) => {
            const likes = await UserService.get_user_likes(parent.id);
            return likes;
        },
        recommend_users: async (parent: User, _: any, ctx: GraphQLContext) => {
            if (!ctx.user) return [];
            const recommeded_users = UserService.get_recommended_users(ctx.user.id);
            return recommeded_users;
           
        },
        reposts: async (parent: User) => {
            const reposts = await UserService.get_user_reposts(parent.id);
            return reposts;
        },
    },
};


export const resolvers = { queries, user_resolvers, mutations };