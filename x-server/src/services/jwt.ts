import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@prisma/client';
import { JWTUser } from '../interfaces';

dotenv.config();

class JWTService {
    public static generate_token_for_user(user: User) {

        const payload: JWTUser = {
            id: user.id,
            email: user.email,
        };

        const token = JWT.sign(payload, process.env.JWT_SECRET as string);
        
        return token;
    }

    public static decode_token(token: string) {
        try {
            return JWT.verify(token, process.env.JWT_SECRET as string) as JWTUser;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default JWTService;
