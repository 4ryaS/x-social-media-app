import { prisma_client } from "../clients/db"
import { redis_client } from "../clients/redis";

export interface CreatePostData {
    content: string
    image_url?: string
    user_id: string
};

class PostService {
    public static async create_post(data: CreatePostData) {
        // const rate_limit_flag = await redis_client.get(`RATE_LIMIT:POST:${data.user_id}`);
        // if (rate_limit_flag) throw new Error("Please Wait...");
        const post = prisma_client.post.create({
            data: {
                content: data.content,
                image_url: data.image_url,
                author: { connect: { id: data.user_id } }
            }
        });
        // await redis_client.setex(`RATE_LIMIT:POST:${data.user_id}`, 10, 1);
        await redis_client.del(`ALL_POSTS`);
        return post;
    };

    public static async delete_post(post_id: string) {
        // const rate_limit_flag = await redis_client.get(`RATE_LIMIT:POST:${data.user_id}`);
        // if (rate_limit_flag) throw new Error("Please Wait...");
        const post = prisma_client.post.delete({
            where: { id: post_id }
        });
        // await redis_client.setex(`RATE_LIMIT:POST:${data.user_id}`, 10, 1);
        await redis_client.del(`ALL_POSTS`);
        return post;
    };

    public static async get_all_posts() {
        const cached_posts = await redis_client.get(`ALL_POSTS`);
        if (cached_posts) return JSON.parse(cached_posts);
        
        const posts = await prisma_client.post.findMany({ orderBy: { created_at: "desc" } });
        await redis_client.set(`ALL_POSTS`, JSON.stringify(posts));
        return posts;
    };

    public static async get_post_by_id(post_id: string) {
        const post = await prisma_client.post.findUnique({ where: { id: post_id } });
        return post;
    };
}

export default PostService;