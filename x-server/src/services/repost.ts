import { prisma_client } from "../clients/db"
import { redis_client } from "../clients/redis";


class RepostService {
    public static async repost_post(post_id: string, user_id: string) {
        // const rate_limit_flag = await redis_client.get(`RATE_LIMIT:POST:${data.user_id}`);
        // if (rate_limit_flag) throw new Error("Please Wait...");
        const existing_repost = await prisma_client.repost.findUnique({
            where: {
                post_id_author_id: {
                    post_id: post_id,
                    author_id: user_id,
                },
            },
        });

        if (existing_repost) {
            throw new Error("You have already reposted this post!");
        }

        const repost = await prisma_client.repost.create({
            data: {
                post: {
                    connect: { id: post_id },
                },
                author: {
                    connect: { id: user_id },
                },
            },
        });

        // await redis_client.setex(`RATE_LIMIT:POST:${data.user_id}`, 10, 1);
        // await redis_client.del(`ALL_POSTS`);
        return repost;
    };

    public static async delete_repost(post_id: string, user_id: string) {
        // const rate_limit_flag = await redis_client.get(`RATE_LIMIT:POST:${data.user_id}`);
        // if (rate_limit_flag) throw new Error("Please Wait...");
        const repost = prisma_client.repost.delete({
            where: {
                post_id_author_id: {
                    post_id: post_id,
                    author_id: user_id,
                },
            },
        });
        // await redis_client.setex(`RATE_LIMIT:POST:${data.user_id}`, 10, 1);
        // await redis_client.del(`ALL_POSTS`);
        return repost;
    };

    public static async get_all_reposts() {
        // const cached_posts = await redis_client.get(`ALL_POSTS`);
        // if (cached_posts) return JSON.parse(cached_posts);
        
        const reposts = await prisma_client.repost.findMany({ orderBy: { created_at: "desc" } });
        // await redis_client.set(`ALL_POSTS`, JSON.stringify(reposts));
        return reposts;
    };
}

export default RepostService;