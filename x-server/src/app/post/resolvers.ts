import { Post } from "@prisma/client";
import { prisma_client } from "../../clients/db";
import { GraphQLContext } from "../../interfaces";

interface CreatePostData {
    content: string
    image_url?: string
};

const queries = {
    get_all_posts: () => {
        const posts = prisma_client.post.findMany({ orderBy: { created_at: "desc" }});
        return posts;
    }
};

const mutations = {
    create_post: async (parent: any, { payload }:{ payload: CreatePostData }, ctx: GraphQLContext) => {

        if (!ctx.user) {
            throw new Error("You are not authenticated!");
        }
        const post = await prisma_client.post.create({
            data: {
                content: payload.content,
                image_url: payload.image_url,
                author: { connect: { id: ctx.user.id } },

            },
        });
        return post;
    },
};

const author_resolvers = {
    Post: {
        author: (parent: Post) => {
            const author = prisma_client.user.findUnique({ where: { id: parent.author_id }});
            return author;
        }
    }
};

export const resolvers = { mutations, author_resolvers, queries };