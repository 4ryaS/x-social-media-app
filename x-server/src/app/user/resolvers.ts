import { prisma_client } from "../../clients/db";
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
        posts: (parent: User) => {
            const posts = prisma_client.post.findMany({ where: { author: { id: parent.id } } });
            return posts;
        },
        followers: async (parent: User) => {
            const followers = await prisma_client.follows.findMany({ where: { following: { id: parent.id } }, include: { follower: true } });
            return followers.map((user) => user.follower);
        },
        following: async (parent: User) => {
            const following = await prisma_client.follows.findMany({ where: { follower: { id: parent.id } }, include: { following: true } });
            return following.map((user) => user.following);
        },
        likes: async (parent: User) => {
            const likes = await prisma_client.likes.findMany({
                where: { user_id: parent.id },
                include: { user: true, post: true },
            });
            return likes;
        },
        recommend_users: async (parent: User, _: any, ctx: GraphQLContext) => {
            if (!ctx.user) return [];

            const cached_value = await redis_client.get(`RECOMMENDED_USERS:${ctx.user.id}`);

            if (cached_value) return JSON.parse(cached_value);

            const recommeded_users: User[] = [];

            const user_following = await prisma_client.follows.findMany({
                where: {
                    follower: { id: ctx.user?.id },
                },
                include: {
                    following: {
                        include: {
                            followers: {
                                include: {
                                    following:
                                        true
                                }
                            }
                        }
                    },
                }
            });

            for (const followings of user_following) {
                for (const followings_of_followed_user of followings.following.followers) {
                    if (followings_of_followed_user.following_id !== ctx.user.id && user_following.findIndex(some_user => some_user.following_id === followings_of_followed_user.following_id) < 0) {
                        recommeded_users.push(followings_of_followed_user.following);
                    }
                }
            }

            await redis_client.set(`RECOMMENDED_USERS:${ctx.user.id}`, JSON.stringify(recommeded_users));
            return recommeded_users;
        }
    },
};


export const resolvers = { queries, user_resolvers, mutations };