import { Post } from "@prisma/client";
import { prisma_client } from "../../clients/db";
import { GraphQLContext } from "../../interfaces";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
import UserService from "../../services/user";
import PostService, { CreatePostData } from "../../services/post";

config();

const s3_client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || "",
    credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "" }
});

const queries = {
    get_all_posts: async () => {
        const posts = await PostService.get_all_posts();
        return posts;
    },
    get_post_by_id: async (parent: any, { post_id }: { post_id: string }) => {
        const post = await PostService.get_post_by_id(post_id);
        return post;
    },
    get_signed_url_for_post: async (parent: any, { image_name, image_type }: { image_name: string, image_type: string }, ctx: GraphQLContext) => {
        if (!ctx.user || !ctx.user.id || !ctx.user.email) {
            throw new Error("Unauthenticated!");
        }

        const allowed_image_types: string[] = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!allowed_image_types.includes(image_type)) {
            throw new Error("Unsupported Image Type");
        }

        const put_object_command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET || "",
            ContentType: image_type,
            Key: `uploads/${ctx.user.id}/posts/${image_name}-${Date.now().toString()}.${image_type}`,
        });

        const signed_url = await getSignedUrl(s3_client, put_object_command, { expiresIn: 7200 });

        return signed_url;
    },
};

const mutations = {
    create_post: async (parent: any, { payload }: { payload: CreatePostData }, ctx: GraphQLContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated!");
        }
        const post = await PostService.create_post({
            ...payload,
            user_id: ctx.user.id
        });
        return post;
    },
    delete_post: async (parent: any, { post_id }: { post_id: string }, ctx: GraphQLContext) => {
        if (!ctx.user) {
            throw new Error("You are not authenticated!");
        }
        const post = await PostService.delete_post(post_id);
        return post;
    },
};

const post_resolvers = {
    Post: {
        author: async (parent: Post) => {
            const author = await UserService.get_user_by_id(parent.author_id);
            return author;
        },
        likes: async (parent: Post) => {
            const likes = await prisma_client.likes.findMany({
                where: { post_id: parent.id },
                include: { post: true, user: true },
            });
            return likes;
        },
        reposts: async (parent: Post) => {
            // Fetch reposts for the post
            const reposts = await prisma_client.repost.findMany({ where: { post_id: parent.id } });
            return reposts;
        }
    }
};

export const resolvers = { queries, mutations, post_resolvers };