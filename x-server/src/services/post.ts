import { prisma_client } from "../clients/db"

export interface CreatePostData {
    content: string
    image_url?: string
    user_id: string
};

class PostService {
    public static create_post(data: CreatePostData) {
        return prisma_client.post.create({
            data: {
                content: data.content,
                image_url: data.image_url,
                author: { connect: { id: data.user_id } }
            }
        });
    }

    public static get_all_posts() {
        return prisma_client.post.findMany({ orderBy: { created_at: "desc" } });
    }
}

export default PostService;