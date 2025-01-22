import { Repost } from "@prisma/client";
import { GraphQLContext } from "../../interfaces";
import RepostService from "../../services/repost";
import UserService from "../../services/user";
import { prisma_client } from "../../clients/db";
import PostService from "../../services/post";


const queries = {
    get_all_reposts: async () => {
        const reposts = await RepostService.get_all_reposts();
        return reposts;
    },
};

const mutations = {
    repost_post: async (parent: any, { post_id }: { post_id: string }, ctx: GraphQLContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated!");
        }
        const repost = await RepostService.repost_post(post_id, ctx.user.id);
        return repost;
    },
    delete_repost: async (parent: any, { post_id }: { post_id: string }, ctx: GraphQLContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated!");
        }
        const repost = await RepostService.delete_repost(post_id, ctx.user.id);
        return repost;
    }

};

const repost_resolvers = {
    Repost: {
        post: async (parent: Repost) => {
            // console.log("Resolving post for repost:", parent);
            const post = await PostService.get_post_by_id(parent.post_id);
            return post;
        },
        author: async (parent: Repost) => {
            const author = await UserService.get_user_by_id(parent.author_id);
            console.log(author);
            return author;
        }
    },
};

export const resolvers = { queries, mutations, repost_resolvers };