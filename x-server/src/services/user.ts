import axios from "axios";
import { prisma_client } from "../clients/db";
import JWTService from "./jwt";

interface GoogleTokenResult {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
};

class UserService {
    public static async verify_google_auth_token(token: string) {
        const google_token = token;
        const google_oauth_url = new URL("https://oauth2.googleapis.com/tokeninfo");
        google_oauth_url.searchParams.set("id_token", google_token);

        const { data } = await axios.get<GoogleTokenResult>(google_oauth_url.toString(), {
            responseType: 'json',
        });

        const user = await prisma_client.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            await prisma_client.user.create({
                data: {
                    email: data.email,
                    first_name: data.given_name,
                    last_name: data.family_name || "",
                    profile_img_url: data.picture,
                },
            });
        }

        const user_in_db = await prisma_client.user.findUnique({ where: { email: data.email } });

        if (!user_in_db) {
            throw new Error("User not found");
        }

        const user_token = JWTService.generate_token_for_user(user_in_db);

        return user_token;
    };

    public static get_user_by_id(id: string) {
        return prisma_client.user.findUnique({ where: { id } });
    };

    public static follow_user(from: string, to: string) {
        return prisma_client.follows.create({
            data : {
                follower: { connect: { id: from } },
                following: { connect: { id: to } },
            },
        });
    };

    public static unfollow_user(from: string, to: string) {
        return prisma_client.follows.delete({
            where: { follower_id_following_id: { follower_id: from, following_id: to } },
        });
    };

    public static async like_post(user_id: string, post_id: string) {
        await prisma_client.likes.create({
            data : {
                user: { connect: { id: user_id } },
                post: { connect: { id: post_id } },
            },
            include: { post: true },
        });
        return true;
    };

    public static async unlike_post(user_id: string, post_id: string) {
        await prisma_client.likes.delete({
            where: { user_id_post_id: { user_id: user_id, post_id: post_id } },
            include: { post: true },
        });
        return true;
    };

    public static async get_all_likes(post_id: string) {
        const likes = await prisma_client.likes.findMany({
            where: { post_id },
            include: { user: true },
        });
        return likes;
    };
}

export default UserService;