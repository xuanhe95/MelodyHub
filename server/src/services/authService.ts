import { AppDataSource } from '../db'; // Make sure this points to where you initialize your TypeORM DataSource
import { User } from '../entity/user';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const privateKey = process.env.privateKey || 'private';

class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    /**
     * Login user
     * @param username 
     * @param password 
     * @returns 
     */

    async loginUser(username: string, password: string): Promise<string | null> {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .addSelect("user.password") // 显式地选择password字段
            .where("user.username = :username", { username })
            .getOne();
        console.log('User:', user);
        if (!user) {
            return null; // User not found
        }


        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return null; // Password does not match
        }

        // Generate and return the JWT token
        const token = this.generateToken({ 
            username: user.username, 
            id: user.id
        });
        console.log('Token:', token);  
        return token;
    }
    /**
     * Verify token
     * @param token 
     * @returns 
     */
    verifyToken(token: string): JwtPayload | null {
        try {
            if(token === undefined || token === null || token === ''){
                return null;
            }
            console.log('Verify Token:', token);
            return jwt.verify(token, privateKey) as JwtPayload;
        } catch (err) {
            console.error('Error verifying token:', err);
            return null;
        }
    }
    
    /**
     * Generate token
     * @param payload 
     * @returns 
     */
    generateToken(payload: any): string {
        return jwt.sign(payload, privateKey, { expiresIn: "5h" });
    }
}

export default AuthService;
