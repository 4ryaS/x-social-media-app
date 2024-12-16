import JWT from 'jsonwebtoken';
import { prisma_client } from "../clients/db";
import dotenv from 'dotenv';
import { User } from '@prisma/client';

dotenv.config();

class JWTService {
    public static generate_token_for_user(user: User) {

        const payload = {
            id: user.id,
            email: user.email,
        };

        // Use process.env to access the JWT_SECRET
        const token = JWT.sign(payload, process.env.JWT_SECRET as string);
        
        return token;
    }
}

export default JWTService;
