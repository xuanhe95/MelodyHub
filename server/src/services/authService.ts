import { AppDataSource } from '../db'; // Make sure this points to where you initialize your TypeORM DataSource
import { User } from '../entity/user';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const privateKey = process.env.privateKey || 'private';

class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    // User login
    async loginUser(username: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) {
            return null; // User not found
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return null; // Password does not match
        }

        // Generate and return the JWT token
        const token = this.generateToken({ username: user.username });
        return token;
    }

    // Verify JWT token
    verifyToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, privateKey) as JwtPayload;
        } catch (err) {
            console.error('Error verifying token:', err);
            return null;
        }
    }
    
    // Generate JWT token
    generateToken(payload: any): string {
        return jwt.sign(payload, privateKey, { expiresIn: "5h" });
    }
}

export default AuthService;
