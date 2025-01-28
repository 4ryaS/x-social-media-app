import axios from "axios";
import { prisma_client } from "../clients/db";
import JWTService from "./jwt";
import { redis_client } from "../clients/redis";
import { User } from "@prisma/client";

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
            data: {
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
            data: {
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

    public static async get_followers(user_id: string) {
        const followers = await prisma_client.follows.findMany({ where: { following: { id: user_id } }, include: { follower: true } });
        return followers.map((user) => user.follower)
    };

    public static async get_following(user_id: string) {
        const following = await prisma_client.follows.findMany({ where: { follower: { id: user_id } }, include: { following: true } });
        return following.map((user) => user.following);
    };

    public static async get_recommended_users(user_id: string) {
        const cached_value = await redis_client.get(`RECOMMENDED_USERS:${user_id}`);
        if (cached_value) return JSON.parse(cached_value);

        const recommeded_users: User[] = [];

        const user_following = await prisma_client.follows.findMany({
            where: {
                follower: { id: user_id },
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
                if (followings_of_followed_user.following_id !== user_id && user_following.findIndex(some_user => some_user.following_id === followings_of_followed_user.following_id) < 0) {
                    recommeded_users.push(followings_of_followed_user.following);
                }
            }
        }

        await redis_client.set(`RECOMMENDED_USERS:${user_id}`, JSON.stringify(recommeded_users));
        return recommeded_users;
    };

    public static async get_user_posts(user_id: string) {
        const posts = prisma_client.post.findMany({ where: { author: { id: user_id } } });
        return posts;
    };

    public static async get_user_likes(user_id: string) {
        const likes = await prisma_client.likes.findMany({
            where: { user_id: user_id },
            include: { user: true, post: true },
        });
        return likes;
    };

    public static async get_user_reposts(user_id: string) {
        const reposts = await prisma_client.repost.findMany({
            where: { author_id: user_id },
        });
        return reposts;
    };
};

export default UserService;