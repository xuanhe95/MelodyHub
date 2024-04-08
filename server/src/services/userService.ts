import { AppDataSource } from '../db'; 
import { User } from '../entity/user';
import bcrypt, { hash } from 'bcrypt';

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async createUser(username: string, password: string): Promise<boolean> {
        try {

            password = await bcrypt.hash(password, 10);
            // Assume password hashing is handled here
            const newUser = this.userRepository.create({
                username,
                password, // Hashed password
            });

            await this.userRepository.save(newUser);
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            const user = await this.userRepository.findOneBy({ id });
            return user;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }
    }

    async getUserByName(username: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findOneBy({ username });
            return user;
        } catch (error) {
            console.error('Error fetching user by username:', error);
            return null;
        }
    }
}
