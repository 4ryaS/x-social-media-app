import { Post } from "@prisma/client";
import { prisma_client } from "../../clients/db";
import { GraphQLContext } from "../../interfaces";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

config();

interface CreatePostData {
    content: string
    image_url?: string
};

const s3_client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || "",
    credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "" }
});

const queries = {
    get_all_posts: () => {
        const posts = prisma_client.post.findMany({ orderBy: { created_at: "desc" } });
        return posts;
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
            const author = prisma_client.user.findUnique({ where: { id: parent.author_id } });
            return author;
        }
    }
};

export const resolvers = { mutations, author_resolvers, queries };