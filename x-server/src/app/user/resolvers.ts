import axios from "axios";
import { prisma_client } from "../../clients/db";
import JWTService from "../../services/jwt";

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

const queries = {
    verify_google_token: async(parent: any, { token }:{ token: string }) => {
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

        const user_in_db = await prisma_client.user.findUnique({ where: { email: data.email }});
        
        if (!user_in_db) {
            throw new Error("User not found");
        }
        
        const user_token = JWTService.generate_token_for_user(user_in_db);

        return user_token; 

    },
};

export const resolvers = { queries };